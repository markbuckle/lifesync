from typing import Optional
from fastapi import Request
from sqlalchemy.orm import Session
from strawberry.fastapi import BaseContext
from app.db.session import get_db
from app.models.user import User as UserModel
from app.core.security import verify_token

class Context(BaseContext):
    def __init__(self, request: Request, db: Session):
        self.request = request
        self.db = db
        self._current_user: Optional[UserModel] = None
        super().__init__()
    
    @property
    def current_user(self) -> Optional[UserModel]:
        """Get current authenticated user from JWT token"""
        if self._current_user:
            return self._current_user
        
        # Get token from Authorization header
        auth_header = self.request.headers.get("Authorization")
        print(f"DEBUG - Auth header: {auth_header}")  # DEBUG

        if not auth_header or not auth_header.startswith("Bearer "):
            print("DEBUG - No auth header or invalid format")  # DEBUG
            return None
        
        token = auth_header.replace("Bearer ", "")
        print(f"DEBUG - Token: {token[:20]}...")  # DEBUG
        
        # Verify token and get user
        try:
            email = verify_token(token)
            print(f"DEBUG - Email from token: {email}")  # DEBUG

            if email:
                from app.services.user_service import get_user_by_email
                self._current_user = get_user_by_email(self.db, email)
                print(f"DEBUG - User found: {self._current_user}")  # DEBUG
        except Exception as e:
            print(f"DEBUG - Token verification error: {e}")  # DEBUG
        
        return self._current_user

async def get_context(request: Request) -> Context:
    """Dependency to create GraphQL context"""
    db_gen = get_db()
    db = next(get_db())
    try:
        return Context(request=request, db=db)
    finally:
        try:
            next(db_gen)
        except StopIteration:
            pass