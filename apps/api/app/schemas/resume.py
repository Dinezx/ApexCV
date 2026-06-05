from datetime import datetime

from pydantic import BaseModel


class ResumeResponse(BaseModel):
    id: int
    original_filename: str
    created_at: datetime

    class Config:
        from_attributes = True


class ResumeComparisonRequest(BaseModel):
    base_resume_id: int
    target_resume_id: int


class ResumeComparisonResponse(BaseModel):
    base_resume_id: int
    target_resume_id: int
    score_delta: int
    missing_keywords_delta: list[str]
    summary: str
