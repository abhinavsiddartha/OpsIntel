from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "OpsIntel - AI Business Operations Intelligence Platform"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "opsintel-super-secret-production-grade-key-change-in-prod-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database
    DATABASE_URL: str = "sqlite:///./opsintel.db"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    
    # AI Engine
    AI_ENGINE_MODE: str = "hybrid"  # hybrid | offline | llm
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    
    # Data Seeding
    SEED_DATA_SIZE: str = "medium"
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"

settings = Settings()
