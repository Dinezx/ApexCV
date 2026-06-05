from sqlalchemy.ext.asyncio import AsyncSession

from app.models.activity_log import ActivityLog
from app.models.user import User


async def log_activity(session: AsyncSession, user: User, action: str, detail: str) -> None:
    session.add(ActivityLog(user_id=user.id, action=action, detail=detail))
