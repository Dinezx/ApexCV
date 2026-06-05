from app.models.user import User
from app.schemas.profile import ProfileUpdateRequest


class ProfileService:
    def update_profile(self, user: User, payload: ProfileUpdateRequest) -> User:
        user.name = payload.name
        return user


profile_service = ProfileService()
