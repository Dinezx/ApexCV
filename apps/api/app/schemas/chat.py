from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=4000)
    resume_id: int | None = None


class ChatResponse(BaseModel):
    response: str
