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
        if not auth_header or not auth_header.startswith("Bearer "):
            return None
        
        token = auth_header.replace("Bearer ", "")
        
        # Verify token and get user
        try:
            email = verify_token(token)
            if email:
                from app.services.user_service import get_user_by_email
                self._current_user = get_user_by_email(self.db, email)
        except:
            pass
        
        return self._current_user

async def get_context(request: Request) -> Context:
    """Dependency to create GraphQL context"""
    db = next(get_db())
    return Context(request=request, db=db)