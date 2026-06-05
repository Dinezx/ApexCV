from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.job_description import (
    JobDescriptionCreateRequest,
    JobDescriptionMatchRequest,
    JobDescriptionMatchResponse,
    JobDescriptionResponse,
)
from app.services.job_description_service import job_description_service

router = APIRouter()


@router.post("", response_model=JobDescriptionResponse)
async def create_job_description(
    payload: JobDescriptionCreateRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> JobDescriptionResponse:
    job_description = await job_description_service.create(session, user, payload)
    return JobDescriptionResponse.model_validate(job_description)


@router.get("", response_model=list[JobDescriptionResponse])
async def list_job_descriptions(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[JobDescriptionResponse]:
    job_descriptions = await job_description_service.list(session, user)
    return [JobDescriptionResponse.model_validate(item) for item in job_descriptions]


@router.post("/match", response_model=JobDescriptionMatchResponse)
async def match_job_description(
    payload: JobDescriptionMatchRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> JobDescriptionMatchResponse:
    return await job_description_service.match(session, user, payload)