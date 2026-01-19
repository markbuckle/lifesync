from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from app.core.config import settings
from app.db.session import engine, Base
from app.models.user import User
from app.models.appointment import Appointment
from app.models.task import Task
from app.models.project import Project
from app.graphql.schema import schema
from app.graphql.context import get_context

# Create database tables
Base.metadata.create_all(bind=engine)

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