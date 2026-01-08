import strawberry
from strawberry.types import Info
from typing import List, Optional
from app.graphql.types import User, Appointment, Task, Project
from app.graphql.context import Context
from app.models.appointment import Appointment as AppointmentModel
from app.models.task import Task as TaskModel
from app.models.project import Project as ProjectModel

@strawberry.type
class Query:
    @strawberry.field
    def me(self, info: Info) -> Optional[User]:
        """Get current authenticated user"""
        context: Context = info.context
        if not context.current_user:
            return None
        
        user = context.current_user
        return User(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            is_active=user.is_active,
            is_superuser=user.is_superuser,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
    
    @strawberry.field
    def appointments(self, info: Info) -> List[Appointment]:
        """Get all appointments for current user"""
        context: Context = info.context
        if not context.current_user:
            raise Exception("Not authenticated")
        
        db_appointments = context.db.query(AppointmentModel).filter(
            AppointmentModel.user_id == context.current_user.id
        ).all()
        
        return [
            Appointment(
                id=apt.id,
                user_id=apt.user_id,
                title=apt.title,
                date=apt.date,
                time=apt.time,
                type=apt.type,
                color=apt.color,
                notes=apt.notes,
                created_at=apt.created_at,
                updated_at=apt.updated_at
            )
            for apt in db_appointments
        ]
    
    @strawberry.field
    def tasks(self, info: Info) -> List[Task]:
        """Get all tasks for current user"""
        context: Context = info.context
        if not context.current_user:
            raise Exception("Not authenticated")
        
        db_tasks = context.db.query(TaskModel).filter(
            TaskModel.user_id == context.current_user.id
        ).all()
        
        return [
            Task(
                id=task.id,
                user_id=task.user_id,
                title=task.title,
                completed=task.completed,
                priority=task.priority,
                due_date=task.due_date,
                category=task.category,
                notes=task.notes,
                created_at=task.created_at,
                updated_at=task.updated_at
            )
            for task in db_tasks
        ]
    
    @strawberry.field
    def projects(self, info: Info) -> List[Project]:
        """Get all projects for current user"""
        context: Context = info.context
        if not context.current_user:
            raise Exception("Not authenticated")
        
        db_projects = context.db.query(ProjectModel).filter(
            ProjectModel.user_id == context.current_user.id
        ).all()
        
        return [
            Project(
                id=proj.id,
                user_id=proj.user_id,
                name=proj.name,
                progress=proj.progress,
                status=proj.status,
                due_date=proj.due_date,
                tasks_completed=proj.tasks_completed,
                tasks_total=proj.tasks_total,
                description=proj.description,
                created_at=proj.created_at,
                updated_at=proj.updated_at
            )
            for proj in db_projects
        ]