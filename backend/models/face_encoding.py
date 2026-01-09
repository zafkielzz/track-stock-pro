"""
Face encoding model for AI service
Stores face embeddings for recognition
"""
from sqlalchemy import Column, Integer, String, LargeBinary, ForeignKey, DateTime
from sqlalchemy.sql import func
from database.session import Base


class FaceEncoding(Base):
    __tablename__ = "face_encodings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    encoding = Column(LargeBinary, nullable=False)  # Stored as numpy array bytes
    image_path = Column(String(500), nullable=True)  # Reference image
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<FaceEncoding(id={self.id}, user_id={self.user_id})>"
