from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    priority = Column(String, nullable=False)  # high, medium, low
    due_date = Column(DateTime, nullable=False)
    category = Column(String, nullable=False)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    user = relationship("User", back_populates="tasks")

    def __repr__(self):
        return f"<Task(id={self.id}, title={self.title})>"