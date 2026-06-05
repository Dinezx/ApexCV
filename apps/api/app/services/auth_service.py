from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest


class AuthService:
    async def register(self, session: AsyncSession, payload: RegisterRequest) -> str:
        existing = await session.execute(select(User).where(User.email == payload.email))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

        user = User(name=payload.name, email=payload.email, password_hash=hash_password(payload.password))
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return create_access_token(str(user.id))

    async def login(self, session: AsyncSession, payload: LoginRequest) -> str:
        query = await session.execute(select(User).where(User.email == payload.email))
        user = query.scalar_one_or_none()
        if not user or not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        return create_access_token(str(user.id))


auth_service = AuthService()
