from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from app.core.config import settings

# Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    # Truncate password to 72 bytes for bcrypt compatibility
    if len(plain_password.encode('utf-8')) > 72:
        plain_password = plain_password[:72]
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    # Truncate password to 72 bytes for bcrypt compatibility
    if len(password.encode('utf-8')) > 72:
        password = password[:72]
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    """Verify JWT token and return email"""
    try:
        print(f"DEBUG verify_token - Decoding token...")  # DEBUG
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        print(f"DEBUG verify_token - Payload: {payload}")  # DEBUG
        email: str = payload.get("sub")
        print(f"DEBUG verify_token - Email extracted: {email}")  # DEBUG
        if email is None:
            print("DEBUG verify_token - Email is None")  # DEBUG
            return None
        return email
    except JWTError as e:
        print(f"DEBUG verify_token - JWTError: {e}")  # DEBUG
        return None
    except Exception as e:
        print(f"DEBUG verify_token - Unexpected error: {e}")  # DEBUG
        return None