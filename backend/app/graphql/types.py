import strawberry
from typing import Optional
from datetime import datetime

# User Types
@strawberry.type
class User:
    id: int
    email: str
    first_name: str
    last_name: str
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

@strawberry.input
class UserCreateInput:
    email: str
    first_name: str
    last_name: str
    password: str

@strawberry.input
class UserLoginInput:
    email: str
    password: str

@strawberry.type
class AuthPayload:
    access_token: str
    token_type: str
    user: User

# Appointment Types
@strawberry.type
class Appointment:
    id: int
    user_id: int
    title: str
    date: datetime
    time: str
    type: str
    color: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

@strawberry.input
class AppointmentInput:
    title: str
    date: datetime
    time: str
    type: str
    color: str
    notes: Optional[str] = None

# Task Types
@strawberry.type
class Task:
    id: int
    user_id: int
    title: str
    completed: bool
    priority: str
    due_date: datetime
    category: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

@strawberry.input
class TaskInput:
    title: str
    completed: bool = False
    priority: str
    due_date: datetime
    category: str
    notes: Optional[str] = None

# Project Types
@strawberry.type
class Project:
    id: int
    user_id: int
    name: str
    progress: int
    status: str
    due_date: datetime
    tasks_completed: int
    tasks_total: int
    description: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

@strawberry.input
class ProjectInput:
    name: str
    progress: int = 0
    status: str
    due_date: datetime
    tasks_completed: int = 0
    tasks_total: int = 0
    description: Optional[str] = None