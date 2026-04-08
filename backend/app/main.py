from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
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
import json
from typing import Optional

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

class MobileCalendarAuthRequest(BaseModel):
    code: str
    redirect_uri: str
    token: str

@app.post("/auth/google/calendar/mobile")
def google_calendar_mobile(body: MobileCalendarAuthRequest, db: Session = Depends(get_db)):
    """Mobile OAuth flow: app exchanges the auth code directly rather than via browser redirect."""
    from app.core.security import verify_token
    from app.services.calendar_service import exchange_code, fetch_calendar_info

    email = verify_token(body.token)
    if not email:
        return {"success": False, "error": "unauthorized"}

    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"success": False, "error": "user_not_found"}

    try:
        tokens = exchange_code(body.code, redirect_uri=body.redirect_uri)
        info = fetch_calendar_info(tokens['refresh_token'])
        user.google_refresh_token = tokens['refresh_token']
        user.google_calendar_email = info['email']
        user.google_calendar_synced_events = info['synced_events']
        db.commit()
        return {"success": True}
    except Exception as e:
        print(f"Mobile calendar auth error: {e}")
        return {"success": False, "error": str(e)}

@app.get("/auth/google/calendar")
def google_calendar_auth(token: str, mobile_redirect: Optional[str] = None):
    """Initiate Google Calendar OAuth. The frontend passes its JWT as ?token=.
    Mobile clients pass ?mobile_redirect=lifesync://calendar so the callback
    can deep-link back into the app instead of redirecting to the web URL.
    """
    error_redirect = f"{mobile_redirect}?error=not_configured" if mobile_redirect else f"{settings.FRONTEND_URL}/calendar?error=not_configured"

    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        return RedirectResponse(error_redirect)

    from app.core.security import verify_token
    email = verify_token(token)
    if not email:
        redir = f"{mobile_redirect}?error=unauthorized" if mobile_redirect else f"{settings.FRONTEND_URL}/calendar?error=unauthorized"
        return RedirectResponse(redir)

    from app.services.calendar_service import get_authorization_url
    state_payload = json.dumps({"token": token, "mobile_redirect": mobile_redirect})
    state = base64.urlsafe_b64encode(state_payload.encode()).decode()
    auth_url = get_authorization_url(state)
    return RedirectResponse(auth_url)


@app.get("/auth/google/calendar/callback")
def google_calendar_callback(code: str, state: str, db: Session = Depends(get_db)):
    """Google redirects here after consent. Exchange code, store tokens."""
    mobile_redirect = None
    try:
        state_payload = base64.urlsafe_b64decode(state.encode()).decode()
        try:
            parsed = json.loads(state_payload)
            token = parsed["token"]
            mobile_redirect = parsed.get("mobile_redirect")
        except (json.JSONDecodeError, KeyError):
            # Fallback: state is a plain token (legacy web flow)
            token = state_payload

        def error_url(msg: str) -> str:
            base = mobile_redirect if mobile_redirect else f"{settings.FRONTEND_URL}/calendar"
            return f"{base}?error={msg}"

        from app.core.security import verify_token
        email = verify_token(token)
        if not email:
            return RedirectResponse(error_url("unauthorized"))

        user = db.query(User).filter(User.email == email).first()
        if not user:
            return RedirectResponse(error_url("user_not_found"))

        from app.services.calendar_service import exchange_code, fetch_calendar_info
        tokens = exchange_code(code)
        info = fetch_calendar_info(tokens['refresh_token'])

        user.google_refresh_token = tokens['refresh_token']
        user.google_calendar_email = info['email']
        user.google_calendar_synced_events = info['synced_events']
        db.commit()

        success_url = f"{mobile_redirect}?calendar_connected=true" if mobile_redirect else f"{settings.FRONTEND_URL}/calendar?calendar_connected=true"
        return RedirectResponse(success_url)
    except Exception as e:
        print(f"Google Calendar callback error: {e}")
        base = mobile_redirect if mobile_redirect else f"{settings.FRONTEND_URL}/calendar"
        return RedirectResponse(f"{base}?error=auth_failed")