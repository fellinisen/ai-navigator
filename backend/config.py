from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SECRET_KEY: str = "change-me"
    DEBUG: bool = True
    MONGO_URL: str = ""
    MONGODB_DB_NAME: str = ""
    # Load env from project root .env (../.env relative to backend/)
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[1] / ".env"),
        env_file_encoding="utf-8",
    )


settings = Settings()
