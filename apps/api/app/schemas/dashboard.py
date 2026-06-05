from pydantic import BaseModel


class TrendPoint(BaseModel):
    label: str
    score: int


class ActivityItem(BaseModel):
    title: str
    detail: str
    time: str


class SkillHeatmapItem(BaseModel):
    skill: str
    level: int


class DashboardOverviewResponse(BaseModel):
    total_resumes: int
    ats_average: int
    matches_generated: int
    interviews_secured: int
    trend: list[TrendPoint]
    activity: list[ActivityItem]
    skill_heatmap: list[SkillHeatmapItem]
