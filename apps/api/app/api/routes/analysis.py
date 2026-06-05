from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.analysis import AnalysisRequest, AnalysisResponse, ExportPdfResponse, RecruiterModeResponse
from app.schemas.job_description import JobDescriptionMatchRequest, JobDescriptionMatchResponse
from app.services.analysis_service import analysis_service
from app.services.job_description_service import job_description_service
from app.utils.pdf_export import export_analysis_pdf

router = APIRouter()


@router.post("", response_model=AnalysisResponse)
async def create_analysis(
    payload: AnalysisRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> AnalysisResponse:
    analysis = await analysis_service.run_analysis(session, user, payload)
    return analysis_service.to_response(analysis)


@router.get("/{resume_id}", response_model=AnalysisResponse)
async def get_analysis(
    resume_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> AnalysisResponse:
    analysis = await analysis_service.get_latest_analysis(session, user, resume_id)
    return analysis_service.to_response(analysis)


@router.get("/{analysis_id}/recruiter", response_model=RecruiterModeResponse)
async def recruiter_mode(
    analysis_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> RecruiterModeResponse:
    return await analysis_service.recruiter_mode(session, user, analysis_id)


@router.get("/{resume_id}/export", response_model=ExportPdfResponse)
async def export_analysis(
    resume_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> ExportPdfResponse:
    analysis = await analysis_service.get_latest_analysis(session, user, resume_id)
    payload = analysis_service.to_response(analysis)
    filename, content_base64 = export_analysis_pdf(payload)
    return ExportPdfResponse(filename=filename, content_base64=content_base64)


@router.post("/job-description", response_model=JobDescriptionMatchResponse)
async def match_job_description(
    payload: JobDescriptionMatchRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> JobDescriptionMatchResponse:
    return await job_description_service.match(session, user, payload)
