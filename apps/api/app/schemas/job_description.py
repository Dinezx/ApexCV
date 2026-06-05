from datetime import datetime

from pydantic import BaseModel, Field


class JobDescriptionCreateRequest(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    content: str = Field(min_length=50, max_length=12000)


class JobDescriptionResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class JobDescriptionMatchRequest(BaseModel):
    resume_id: int
    title: str = Field(min_length=3, max_length=200)
    content: str = Field(min_length=50, max_length=12000)


class JobDescriptionMatchResponse(BaseModel):
    job_description_id: int
    resume_id: int
    match_percentage: int
    matched_keywords: list[str]
    missing_keywords: list[str]
    summary: str
    suggestions: list[str]
    jobs: list[dict] = []


class JobDescriptionGenerateRequest(BaseModel):
    title: str = Field(min_length=3, max_length=200)


class JobDescriptionGenerateResponse(BaseModel):
    content: str
