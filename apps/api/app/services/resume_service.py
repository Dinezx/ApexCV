from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.analysis_result import AnalysisResult
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeComparisonResponse
from app.services.activity_service import log_activity
from app.utils.resume_parser import UnsupportedFileTypeError, extract_text_from_resume

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


class ResumeService:
    async def upload_resume(self, session: AsyncSession, user: User, file: UploadFile) -> Resume:
        if not file.filename:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing filename")

        extension = Path(file.filename).suffix.lower()
        if extension not in {".pdf", ".docx"}:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF and DOCX files are supported")

        content = await file.read()
        if len(content) > settings.max_upload_size_mb * 1024 * 1024:
            raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large")

        storage_name = f"{uuid4().hex}{extension}"
        storage_path = UPLOAD_DIR / storage_name
        storage_path.write_bytes(content)

        try:
            extracted_text = extract_text_from_resume(storage_path)
        except UnsupportedFileTypeError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

        if not extracted_text.strip():
            extracted_text = "Resume text extraction produced minimal output."

        resume = Resume(
            user_id=user.id,
            original_filename=file.filename,
            storage_path=str(storage_path),
            extracted_text=extracted_text,
        )
        session.add(resume)
        await log_activity(session, user, "resume_upload", f"Uploaded {file.filename}")
        await session.commit()
        await session.refresh(resume)
        return resume

    async def list_resumes(self, session: AsyncSession, user: User) -> list[Resume]:
        result = await session.execute(select(Resume).where(Resume.user_id == user.id).order_by(Resume.created_at.desc()))
        return list(result.scalars().all())

    async def compare(self, session: AsyncSession, user: User, base_resume_id: int, target_resume_id: int) -> ResumeComparisonResponse:
        base_query = await session.execute(select(AnalysisResult).join(Resume).where(Resume.user_id == user.id, Resume.id == base_resume_id).order_by(AnalysisResult.created_at.desc()))
        target_query = await session.execute(select(AnalysisResult).join(Resume).where(Resume.user_id == user.id, Resume.id == target_resume_id).order_by(AnalysisResult.created_at.desc()))

        base_analysis = base_query.scalars().first()
        target_analysis = target_query.scalars().first()
        if not base_analysis or not target_analysis:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found for one or both resumes")

        missing_delta = [kw for kw in base_analysis.missing_keywords if kw not in target_analysis.missing_keywords]
        return ResumeComparisonResponse(
            base_resume_id=base_resume_id,
            target_resume_id=target_resume_id,
            score_delta=target_analysis.ats_score - base_analysis.ats_score,
            missing_keywords_delta=missing_delta,
            summary="Target resume improved keyword alignment and ATS compatibility." if target_analysis.ats_score >= base_analysis.ats_score else "Target resume regressed in ATS alignment.",
        )


resume_service = ResumeService()
