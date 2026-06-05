from datetime import datetime

from pydantic import BaseModel


class AnalysisRequest(BaseModel):
    resume_id: int
    target_role: str
    include_recruiter_mode: bool = False


class AnalysisResponse(BaseModel):
    id: int
    resume_id: int
    ats_score: int
    role_match: str
    summary: str
    suggestions: list[str]
    missing_keywords: list[str]
    skill_gap: list[str]
    jobs: list[dict] = []
    created_at: datetime

    class Config:
        from_attributes = True


class RecruiterModeResponse(BaseModel):
    analysis_id: int
    shortlist_signal: str
    strengths: list[str]
    concerns: list[str]


class ExportPdfResponse(BaseModel):
    filename: str
    content_base64: str
