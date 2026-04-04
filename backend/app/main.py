from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from strawberry.fastapi import GraphQLRouter
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.db.session import engine, Base, get_db
from app.models.user import User
from app.models.appointment import Appointment
from app.models.task import Task
from app.models.project import Project
from app.models.password_reset import PasswordResetToken
from app.graphql.schema import schema
from app.graphql.context import get_context
import base64

# Create database tables
Base.metadata.create_all(bind=engine)

# Add Google Calendar columns to existing databases (safe no-op if already present)
def _run_column_migrations():
    with engine.connect() as conn:
        for col, typedef in [
            ("google_refresh_token", "TEXT"),
            ("google_calendar_email", "TEXT"),
            ("google_calendar_synced_events", "INTEGER"),
        ]:
            try:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} {typedef}"))
                conn.commit()
            except Exception:
                pass

_run_column_migrations()

app = FastAPI(
    title="LifeSync API",
    description="AI-powered life management platform with GraphQL",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GraphQL endpoint
graphql_app = GraphQLRouter(
    schema,
    context_getter=get_context,
)

app.include_router(graphql_app, prefix="/graphql")

@app.get("/")
def read_root():
    return {
        "message": "Welcome to LifeSync API",
        "status": "running",
        "version": "1.0.0",
        "graphql": "/graphql"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}


# ── Google Calendar OAuth ─────────────────────────────────────────────────────

@app.get("/auth/google/calendar")
def google_calendar_auth(token: str):
    """Initiate Google Calendar OAuth. The frontend passes its JWT as ?token=."""
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        return RedirectResponse(f"{settings.FRONTEND_URL}/calendar?error=not_configured")

    from app.core.security import verify_token
    email = verify_token(token)
    if not email:
        return RedirectResponse(f"{settings.FRONTEND_URL}/calendar?error=unauthorized")

    from app.services.calendar_service import get_authorization_url
    state = base64.urlsafe_b64encode(token.encode()).decode()
    auth_url = get_authorization_url(state)
    return RedirectResponse(auth_url)


@app.get("/auth/google/calendar/callback")
def google_calendar_callback(code: str, state: str, db: Session = Depends(get_db)):
    """Google redirects here after consent. Exchange code, store tokens."""
    try:
        token = base64.urlsafe_b64decode(state.encode()).decode()

        from app.core.security import verify_token
        email = verify_token(token)
        if not email:
            return RedirectResponse(f"{settings.FRONTEND_URL}/calendar?error=unauthorized")

        user = db.query(User).filter(User.email == email).first()
        if not user:
            return RedirectResponse(f"{settings.FRONTEND_URL}/calendar?error=user_not_found")

        from app.services.calendar_service import exchange_code, fetch_calendar_info
        tokens = exchange_code(code)
        info = fetch_calendar_info(tokens['refresh_token'])

        user.google_refresh_token = tokens['refresh_token']
        user.google_calendar_email = info['email']
        user.google_calendar_synced_events = info['synced_events']
        db.commit()

        return RedirectResponse(f"{settings.FRONTEND_URL}/calendar?calendar_connected=true")
    except Exception as e:
        print(f"Google Calendar callback error: {e}")
        return RedirectResponse(f"{settings.FRONTEND_URL}/calendar?error=auth_failed")