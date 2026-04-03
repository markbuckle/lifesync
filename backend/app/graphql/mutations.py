import strawberry
from strawberry.types import Info
from typing import Optional
from datetime import timedelta
from app.graphql.types import (
    User, AuthPayload, UserCreateInput, UserLoginInput,
    Appointment, AppointmentInput,
    Task, TaskInput,
    Project, ProjectInput,
    MessagePayload,
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
    
    @strawberry.mutation
    def update_appointment(self, id: int, appointment_input: AppointmentInput, info: Info) -> Appointment:
        """Update an existing appointment (requires authentication)"""
        context: Context = info.context
        
        if not context.current_user:
            raise Exception("Not authenticated")
        
        # Get the appointment
        db_appointment = context.db.query(AppointmentModel).filter(
            AppointmentModel.id == id,
            AppointmentModel.user_id == context.current_user.id
        ).first()
        
        if not db_appointment:
            raise Exception("Appointment not found")
        
        # Update fields
        db_appointment.title = appointment_input.title
        db_appointment.date = appointment_input.date
        db_appointment.time = appointment_input.time
        db_appointment.type = appointment_input.type
        db_appointment.color = appointment_input.color
        db_appointment.notes = appointment_input.notes
        
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
    def delete_appointment(self, id: int, info: Info) -> Appointment:
        """Delete an appointment (requires authentication)"""
        context: Context = info.context
        
        if not context.current_user:
            raise Exception("Not authenticated")
        
        # Get the appointment
        db_appointment = context.db.query(AppointmentModel).filter(
            AppointmentModel.id == id,
            AppointmentModel.user_id == context.current_user.id
        ).first()
        
        if not db_appointment:
            raise Exception("Appointment not found")
        
        # Store data before deletion
        appointment_data = Appointment(
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
        
        # Delete
        context.db.delete(db_appointment)
        context.db.commit()
        
        return appointment_data
    
    @strawberry.mutation
    def update_task(self, id: int, task_input: TaskInput, info: Info) -> Task:
        """Update an existing task (requires authentication)"""
        context: Context = info.context
        
        if not context.current_user:
            raise Exception("Not authenticated")
        
        # Get the task
        db_task = context.db.query(TaskModel).filter(
            TaskModel.id == id,
            TaskModel.user_id == context.current_user.id
        ).first()
        
        if not db_task:
            raise Exception("Task not found")
        
        # Update fields
        db_task.title = task_input.title
        db_task.completed = task_input.completed
        db_task.priority = task_input.priority
        db_task.due_date = task_input.due_date
        db_task.category = task_input.category
        db_task.notes = task_input.notes
        
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
    def delete_task(self, id: int, info: Info) -> Task:
        """Delete a task (requires authentication)"""
        context: Context = info.context
        
        if not context.current_user:
            raise Exception("Not authenticated")
        
        # Get the task
        db_task = context.db.query(TaskModel).filter(
            TaskModel.id == id,
            TaskModel.user_id == context.current_user.id
        ).first()
        
        if not db_task:
            raise Exception("Task not found")
        
        # Store data before deletion
        task_data = Task(
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
        
        # Delete
        context.db.delete(db_task)
        context.db.commit()
        
        return task_data
    
    @strawberry.mutation
    def update_project(self, id: int, project_input: ProjectInput, info: Info) -> Project:
        """Update an existing project (requires authentication)"""
        context: Context = info.context
        
        if not context.current_user:
            raise Exception("Not authenticated")
        
        # Get the project
        db_project = context.db.query(ProjectModel).filter(
            ProjectModel.id == id,
            ProjectModel.user_id == context.current_user.id
        ).first()
        
        if not db_project:
            raise Exception("Project not found")
        
        # Update fields
        db_project.name = project_input.name
        db_project.progress = project_input.progress
        db_project.status = project_input.status
        db_project.due_date = project_input.due_date
        db_project.tasks_completed = project_input.tasks_completed
        db_project.tasks_total = project_input.tasks_total
        db_project.description = project_input.description
        
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
    
    @strawberry.mutation
    def delete_project(self, id: int, info: Info) -> Project:
        """Delete a project (requires authentication)"""
        context: Context = info.context
        
        if not context.current_user:
            raise Exception("Not authenticated")
        
        # Get the project
        db_project = context.db.query(ProjectModel).filter(
            ProjectModel.id == id,
            ProjectModel.user_id == context.current_user.id
        ).first()
        
        if not db_project:
            raise Exception("Project not found")
        
        # Store data before deletion
        project_data = Project(
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
        
        # Delete
        context.db.delete(db_project)
        context.db.commit()

        return project_data

    @strawberry.mutation
    def request_password_reset(self, email: str, info: Info) -> MessagePayload:
        """Request a password reset link — sends email via Resend, falls back to console."""
        import secrets
        from datetime import datetime, timedelta
        from app.models.password_reset import PasswordResetToken
        from app.services.email_service import send_password_reset_email

        context: Context = info.context
        user = get_user_by_email(context.db, email)

        if user:
            token = secrets.token_urlsafe(32)
            expires_at = datetime.utcnow() + timedelta(hours=1)
            reset_token = PasswordResetToken(
                user_id=user.id,
                token=token,
                expires_at=expires_at,
            )
            context.db.add(reset_token)
            context.db.commit()

            reset_link = f"{settings.FRONTEND_URL}/reset-password/{token}"
            sent = send_password_reset_email(email, reset_link)
            if not sent:
                # Fallback: log to console when email is not configured
                print(f"\n{'=' * 50}")
                print(f"PASSWORD RESET (email not configured)")
                print(f"Email  : {email}")
                print(f"Link   : {reset_link}")
                print(f"Expires: {expires_at} UTC")
                print(f"{'=' * 50}\n")

        # Always succeed — never reveal whether the email exists
        return MessagePayload(
            success=True,
            message="If an account with that email exists, a password reset link has been sent.",
        )

    @strawberry.mutation
    def reset_password(self, token: str, new_password: str, info: Info) -> MessagePayload:
        """Reset a user's password using a valid reset token"""
        from datetime import datetime
        from app.models.password_reset import PasswordResetToken
        from app.core.security import get_password_hash

        context: Context = info.context

        reset_token = context.db.query(PasswordResetToken).filter(
            PasswordResetToken.token == token,
            PasswordResetToken.used == False,  # noqa: E712
        ).first()

        if not reset_token:
            raise Exception("Invalid or expired reset link.")

        if datetime.utcnow() > reset_token.expires_at:
            raise Exception("This reset link has expired. Please request a new one.")

        if len(new_password) < 8:
            raise Exception("Password must be at least 8 characters.")

        user = context.db.query(UserModel).filter(UserModel.id == reset_token.user_id).first()
        user.hashed_password = get_password_hash(new_password)
        reset_token.used = True
        context.db.commit()

        return MessagePayload(success=True, message="Your password has been reset successfully.")