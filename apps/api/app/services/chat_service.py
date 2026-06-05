from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.resume import Resume
from app.models.user import User
from app.services.openai_service import openai_service


class ChatService:
    async def ask(self, session: AsyncSession, user: User, message: str, resume_id: int | None = None) -> str:
        context = None
        if resume_id is not None:
            query = await session.execute(select(Resume).where(Resume.id == resume_id, Resume.user_id == user.id))
            resume = query.scalar_one_or_none()
            context = resume.extracted_text if resume else None
        return await openai_service.chat_assistant(message=message, resume_context=context)


chat_service = ChatService()
