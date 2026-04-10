from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "LifeSync"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./lifesync.db"
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    # Email (Resend)
    RESEND_API_KEY: Optional[str] = None
    EMAIL_FROM: str = "LifeSync <noreply@lifesync.app>"

    # Google Calendar OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/auth/google/calendar/callback"

    # Optional: Firestore (for future AI integration)
    GOOGLE_CLOUD_PROJECT: Optional[str] = None
    FIRESTORE_COLLECTION: Optional[str] = "ai_conversations"
    
    # Personal
    MY_PHONE_NUMBER: Optional[str] = None
    MY_EMAIL: Optional[str] = None

    # Twilio SMS
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None
    RECOVERY_CODE: Optional[str] = None
    MessagingServiceSid: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()