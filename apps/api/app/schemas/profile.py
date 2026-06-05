from pydantic import BaseModel, Field


class ProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str


class ProfileUpdateRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
