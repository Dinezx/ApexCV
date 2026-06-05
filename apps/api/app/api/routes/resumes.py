from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.resume import ResumeComparisonRequest, ResumeComparisonResponse, ResumeResponse
from app.services.resume_service import resume_service

router = APIRouter()


@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> ResumeResponse:
    resume = await resume_service.upload_resume(session, user, file)
    return ResumeResponse.model_validate(resume)


@router.get("", response_model=list[ResumeResponse])
async def list_resumes(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[ResumeResponse]:
    resumes = await resume_service.list_resumes(session, user)
    return [ResumeResponse.model_validate(resume) for resume in resumes]


@router.post("/compare", response_model=ResumeComparisonResponse)
async def compare_resumes(
    payload: ResumeComparisonRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> ResumeComparisonResponse:
    return await resume_service.compare(session, user, payload.base_resume_id, payload.target_resume_id)
