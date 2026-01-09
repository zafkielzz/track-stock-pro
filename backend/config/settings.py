"""
Configuration settings using Pydantic
Load from .env file
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Track Stock Pro"
    DEBUG: bool = True
    API_PORT: int = 3000
    AI_PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "sqlite:///./track_stock.db"
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    # AI
    FACE_RECOGNITION_TOLERANCE: float = 0.6
    FACE_ENCODING_MODEL: str = "large"
    MAX_FACE_DISTANCE: float = 0.6
    
    # File Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 5242880  # 5MB
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]


settings = Settings()
