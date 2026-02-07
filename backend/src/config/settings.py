from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database configuration
    database_url: str = "postgresql+asyncpg://neondb_owner:npg_bgzqipC5DKe4@ep-twilight-breeze-ah8ijng4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

    # JWT/Session configuration
    jwt_secret: str = "dev-secret-key-change-in-production-12345"
    jwt_algorithm: str = "HS256"

    # API configuration
    api_prefix: str = "/api"

    # CORS configuration
    cors_origins: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"


settings = Settings()
