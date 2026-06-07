from functools import lru_cache

from pydantic import Field, field_validator
# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)

    app_env: str = Field(default="development", alias="APP_ENV")
    api_v1_prefix: str = Field(default="/api/v1", alias="API_V1_PREFIX")
    database_url: str = Field(default="postgresql+asyncpg://postgres:postgres@localhost:5432/resume_analyzer", alias="DATABASE_URL")
    jwt_secret: str = Field(default="dev-only-change-me", alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    jwt_expire_minutes: int = Field(default=60 * 24, alias="JWT_EXPIRE_MINUTES")
    openai_api_key: str | None = Field(default=None, alias="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4.1-mini", alias="OPENAI_MODEL")
    max_upload_size_mb: int = Field(default=8, alias="MAX_UPLOAD_SIZE_MB")
    cors_origins: list[str] = Field(
        default=[
            "http://localhost:3000",
            "https://apexcv-1ch97m0cc-dinezxs-projects.vercel.app",
            "https://apexcv-git-main-dinezxs-projects.vercel.app",
        ],
        alias="CORS_ORIGINS",
    )
    rate_limit_per_minute: int = Field(default=80, alias="RATE_LIMIT_PER_MINUTE")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: any) -> list[str]:
        origins = []
        if isinstance(v, str):
            import json
            try:
                # Try to parse as JSON list first
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    origins = parsed
            except Exception:
                pass
            if not origins:
                # Fallback to comma-separated list
                origins = [origin.strip() for origin in v.split(",") if origin.strip()]
        elif isinstance(v, list):
            origins = v
        else:
            origins = ["http://localhost:3000"]

        # Always ensure Vercel production and preview domains are allowed
        vercel_origins = [
            "https://apexcv-1ch97m0cc-dinezxs-projects.vercel.app",
            "https://apexcv-git-main-dinezxs-projects.vercel.app",
        ]
        for origin in vercel_origins:
            if origin not in origins:
                origins.append(origin)
        return origins


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
