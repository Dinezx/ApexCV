from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.analysis_result import AnalysisResult
from app.models.resume import Resume
from app.models.user import User
from app.schemas.analysis import AnalysisRequest, AnalysisResponse, RecruiterModeResponse
from app.services.activity_service import log_activity
from app.services.openai_service import openai_service
from app.utils.analysis_engine import compute_ats_score, derive_skill_gap, detect_keywords, generate_smart_suggestions


class AnalysisService:
    async def run_analysis(self, session: AsyncSession, user: User, payload: AnalysisRequest) -> AnalysisResult:
        resume_query = await session.execute(select(Resume).where(Resume.id == payload.resume_id, Resume.user_id == user.id))
        resume = resume_query.scalar_one_or_none()
        if not resume:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

        present, missing = detect_keywords(resume.extracted_text, payload.target_role)
        ats_score = compute_ats_score(len(present), len(missing))
        summary = await openai_service.generate_resume_summary(resume.extracted_text, payload.target_role, present, missing)
        suggestions = generate_smart_suggestions(resume.extracted_text, present, missing, payload.target_role)
        skill_gap = derive_skill_gap(missing)
        jobs = await openai_service.generate_job_vacancies(payload.target_role, present)

        analysis = AnalysisResult(
            resume_id=resume.id,
            ats_score=ats_score,
            role_match=payload.target_role,
            summary=summary,
            suggestions=suggestions,
            missing_keywords=missing[:8],
            skill_gap=skill_gap,
            meta={"present_keywords": present[:12], "jobs": jobs},
        )
        session.add(analysis)
        await log_activity(session, user, "analysis_run", f"Generated ATS analysis for resume {resume.id}")
        await session.commit()
        await session.refresh(analysis)
        return analysis

    async def get_latest_analysis(self, session: AsyncSession, user: User, resume_id: int) -> AnalysisResult:
        query = await session.execute(
            select(AnalysisResult)
            .join(Resume)
            .where(Resume.user_id == user.id, Resume.id == resume_id)
            .order_by(AnalysisResult.created_at.desc())
        )
        analysis = query.scalars().first()
        if not analysis:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")
        return analysis

    async def recruiter_mode(self, session: AsyncSession, user: User, analysis_id: int) -> RecruiterModeResponse:
        query = await session.execute(
            select(AnalysisResult)
            .join(Resume)
            .where(Resume.user_id == user.id, AnalysisResult.id == analysis_id)
        )
        analysis = query.scalar_one_or_none()
        if not analysis:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")

        shortlist_signal = "Strong shortlist" if analysis.ats_score >= 80 else "Review with caution"
        strengths = [
            "Clear technical stack references",
            "Good role relevance",
            "High ATS structural compatibility",
        ]
        concerns = [
            "Needs stronger quantified outcomes",
            "Some role keywords remain missing",
        ]
        return RecruiterModeResponse(
            analysis_id=analysis.id,
            shortlist_signal=shortlist_signal,
            strengths=strengths,
            concerns=concerns,
        )

    @staticmethod
    def to_response(model: AnalysisResult) -> AnalysisResponse:
        return AnalysisResponse(
            id=model.id,
            resume_id=model.resume_id,
            ats_score=model.ats_score,
            role_match=model.role_match,
            summary=model.summary,
            suggestions=model.suggestions,
            missing_keywords=model.missing_keywords,
            skill_gap=model.skill_gap,
            jobs=model.meta.get("jobs", []),
            created_at=model.created_at,
        )


analysis_service = AnalysisService()
