import strawberry
from strawberry.types import Info
from typing import Optional
from datetime import timedelta
from app.graphql.types import (
    User, AuthPayload, UserCreateInput, UserLoginInput,
    Appointment, AppointmentInput,
    Task, TaskInput,
    Project, ProjectInput
)
from app.graphql.context import Context
from app.services.user_service import create_user, authenticate_user, get_user_by_email
from app.core.security import create_access_token
from app.core.config import settings
from app.models.user import User as UserModel
from app.models.appointment import Appointment as AppointmentModel
from app.models.task import Task as TaskModel
from app.models.project import Project as ProjectModel

@strawberry.type
class Mutation:
    @strawberry.mutation
    def register(self, user_input: UserCreateInput, info: Info) -> User:
        """Register a new user"""
        context: Context = info.context
        
        # Check if user exists
        existing_user = get_user_by_email(context.db, user_input.email)
        if existing_user:
            raise Exception("Email already registered")
        
        # Create user using Pydantic schema for service
        from app.schemas.user import UserCreate
        user_data = UserCreate(
            email=user_input.email,
            first_name=user_input.first_name,
            last_name=user_input.last_name,
            password=user_input.password
        )
        
        db_user = create_user(context.db, user_data)
        
        return User(
            id=db_user.id,
            email=db_user.email,
            first_name=db_user.first_name,
            last_name=db_user.last_name,
            is_active=db_user.is_active,
            is_superuser=db_user.is_superuser,
            created_at=db_user.created_at,
            updated_at=db_user.updated_at
        )
    
    @strawberry.mutation
    def login(self, credentials: UserLoginInput, info: Info) -> AuthPayload:
        """Login and get access token"""
        context: Context = info.context
        
        user = authenticate_user(context.db, credentials.email, credentials.password)
        if not user:
            raise Exception("Incorrect email or password")
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        return AuthPayload(
            access_token=access_token,
            token_type="bearer",
            user=User(
                id=user.id,
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                is_active=user.is_active,
                is_superuser=user.is_superuser,
                created_at=user.created_at,
                updated_at=user.updated_at
            )
        )
    
    @strawberry.mutation
    def create_appointment(self, appointment_input: AppointmentInput, info: Info) -> Appointment:
        """Create a new appointment (requires authentication)"""
        context: Context = info.context
        
        if not context.current_user:
            raise Exception("Not authenticated")
        
        db_appointment = AppointmentModel(
            user_id=context.current_user.id,
            title=appointment_input.title,
            date=appointment_input.date,
            time=appointment_input.time,
            type=appointment_input.type,
            color=appointment_input.color,
            notes=appointment_input.notes
        )
        
        context.db.add(db_appointment)
        context.db.commit()
        context.db.refresh(db_appointment)
        
        return Appointment(
            id=db_appointment.id,
            user_id=db_appointment.user_id,
            title=db_appointment.title,
            date=db_appointment.date,
            time=db_appointment.time,
            type=db_appointment.type,
            color=db_appointment.color,
            notes=db_appointment.notes,
            created_at=db_appointment.created_at,
            updated_at=db_appointment.updated_at
        )
    
    @strawberry.mutation
    def create_task(self, task_input: TaskInput, info: Info) -> Task:
        """Create a new task (requires authentication)"""
        context: Context = info.context
        
        if not context.current_user:
            raise Exception("Not authenticated")
        
        db_task = TaskModel(
            user_id=context.current_user.id,
            title=task_input.title,
            completed=task_input.completed,
            priority=task_input.priority,
            due_date=task_input.due_date,
            category=task_input.category,
            notes=task_input.notes
        )
        
        context.db.add(db_task)
        context.db.commit()
        context.db.refresh(db_task)
        
        return Task(
            id=db_task.id,
            user_id=db_task.user_id,
            title=db_task.title,
            completed=db_task.completed,
            priority=db_task.priority,
            due_date=db_task.due_date,
            category=db_task.category,
            notes=db_task.notes,
            created_at=db_task.created_at,
            updated_at=db_task.updated_at
        )
    
    @strawberry.mutation
    def create_project(self, project_input: ProjectInput, info: Info) -> Project:
        """Create a new project (requires authentication)"""
        context: Context = info.context
        
        if not context.current_user:
            raise Exception("Not authenticated")
        
        db_project = ProjectModel(
            user_id=context.current_user.id,
            name=project_input.name,
            progress=project_input.progress,
            status=project_input.status,
            due_date=project_input.due_date,
            tasks_completed=project_input.tasks_completed,
            tasks_total=project_input.tasks_total,
            description=project_input.description
        )
        
        context.db.add(db_project)
        context.db.commit()
        context.db.refresh(db_project)
        
        return Project(
            id=db_project.id,
            user_id=db_project.user_id,
            name=db_project.name,
            progress=db_project.progress,
            status=db_project.status,
            due_date=db_project.due_date,
            tasks_completed=db_project.tasks_completed,
            tasks_total=db_project.tasks_total,
            description=db_project.description,
            created_at=db_project.created_at,
            updated_at=db_project.updated_at
        )