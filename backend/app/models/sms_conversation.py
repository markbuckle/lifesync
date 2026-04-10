# Conversation State Model - keeps track of where each user is in the booking conversation
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db.session import Base


class SMSConversation(Base):
    __tablename__ = "sms_conversations"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True)
    state = Column(String, default="idle")
    pending_title = Column(String, nullable=True)
    pending_date = Column(String, nullable=True)
    pending_time = Column(String, nullable=True)
    pending_type = Column(String, nullable=True)
    user_id = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())