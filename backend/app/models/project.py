from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    progress = Column(Integer, default=0)  # 0-100
    status = Column(String, nullable=False)  # on-track, at-risk, delayed
    due_date = Column(DateTime, nullable=False)
    tasks_completed = Column(Integer, default=0)
    tasks_total = Column(Integer, default=0)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    user = relationship("User", back_populates="projects")

    def __repr__(self):
        return f"<Project(id={self.id}, name={self.name})>"