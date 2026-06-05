from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.profile import ProfileResponse, ProfileUpdateRequest
from app.services.profile_service import profile_service

router = APIRouter()


@router.get("", response_model=ProfileResponse)
async def get_profile(user: User = Depends(get_current_user)) -> ProfileResponse:
    return ProfileResponse(id=user.id, name=user.name, email=user.email, role=user.role.value)


@router.patch("", response_model=ProfileResponse)
async def update_profile(
    payload: ProfileUpdateRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> ProfileResponse:
    profile_service.update_profile(user, payload)
    await session.commit()
    await session.refresh(user)
    return ProfileResponse(id=user.id, name=user.name, email=user.email, role=user.role.value)
