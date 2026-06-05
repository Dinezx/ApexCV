from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job_description import JobDescription
from app.models.resume import Resume
from app.models.user import User
from app.schemas.job_description import (
    JobDescriptionCreateRequest,
    JobDescriptionMatchRequest,
    JobDescriptionMatchResponse,
)
from app.services.activity_service import log_activity
from app.services.openai_service import openai_service
from app.utils.analysis_engine import generate_smart_suggestions
from app.utils.job_match import compare_job_description


class JobDescriptionService:
    async def create(self, session: AsyncSession, user: User, payload: JobDescriptionCreateRequest) -> JobDescription:
        job_description = JobDescription(user_id=user.id, title=payload.title, content=payload.content)
        session.add(job_description)
        await log_activity(session, user, "job_description_saved", f"Saved job description {payload.title}")
        await session.commit()
        await session.refresh(job_description)
        return job_description

    async def list(self, session: AsyncSession, user: User) -> list[JobDescription]:
        query = await session.execute(select(JobDescription).where(JobDescription.user_id == user.id).order_by(JobDescription.created_at.desc()))
        return list(query.scalars().all())

    async def match(self, session: AsyncSession, user: User, payload: JobDescriptionMatchRequest) -> JobDescriptionMatchResponse:
        resume_query = await session.execute(select(Resume).where(Resume.id == payload.resume_id, Resume.user_id == user.id))
        resume = resume_query.scalar_one_or_none()
        if not resume:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

        job_description = JobDescription(user_id=user.id, title=payload.title, content=payload.content)
        session.add(job_description)
        # 1. Try to run matching using Gemini API
        ai_match = await openai_service.match_resume_to_jd(resume.extracted_text, payload.content, payload.title)
        
        if ai_match:
            score = ai_match["match_percentage"]
            matched = ai_match["matched_keywords"]
            missing = ai_match["missing_keywords"]
            summary = ai_match["summary"]
            suggestions = ai_match["suggestions"]
        else:
            # Fall back to high-quality local rules-based engine
            score, matched, missing = compare_job_description(resume.extracted_text, payload.content)
            summary = await openai_service.generate_resume_summary(resume.extracted_text, payload.title, matched, missing)
            suggestions = generate_smart_suggestions(resume.extracted_text, matched, missing, payload.title)

        jobs = await openai_service.generate_job_vacancies(payload.title, matched)

        await log_activity(session, user, "job_match", f"Matched resume {resume.id} against {payload.title}")
        await session.commit()
        await session.refresh(job_description)

        return JobDescriptionMatchResponse(
            job_description_id=job_description.id,
            resume_id=resume.id,
            match_percentage=score,
            matched_keywords=matched,
            missing_keywords=missing[:12],
            summary=summary,
            suggestions=suggestions,
            jobs=jobs,
        )



job_description_service = JobDescriptionService()