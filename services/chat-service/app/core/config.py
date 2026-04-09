from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Chat Service"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@ttp-postgres:5432/ttp"
    REDIS_URL: str = "redis://ttp-redis:6379/1"  # Database 1 for chat pub/sub
    JWT_SECRET: str = "supersecret_jwt_key_that_should_be_changed_in_prod"
    JWT_ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"

settings = Settings()