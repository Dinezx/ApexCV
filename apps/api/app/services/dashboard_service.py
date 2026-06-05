from datetime import UTC, datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.activity_log import ActivityLog
from app.models.analysis_result import AnalysisResult
from app.models.resume import Resume
from app.models.user import User
from app.schemas.dashboard import ActivityItem, DashboardOverviewResponse, SkillHeatmapItem, TrendPoint


class DashboardService:
    async def overview(self, session: AsyncSession, user: User) -> DashboardOverviewResponse:
        resumes_count_query = await session.execute(select(func.count(Resume.id)).where(Resume.user_id == user.id))
        total_resumes = int(resumes_count_query.scalar_one() or 0)

        average_query = await session.execute(
            select(func.avg(AnalysisResult.ats_score))
            .join(Resume)
            .where(Resume.user_id == user.id)
        )
        avg_value = average_query.scalar_one()
        ats_average = int(round(avg_value)) if avg_value is not None else 0

        analyses_query = await session.execute(
            select(AnalysisResult)
            .join(Resume)
            .where(Resume.user_id == user.id)
            .order_by(AnalysisResult.created_at.desc())
            .limit(7)
        )
        analyses = list(analyses_query.scalars().all())

        trend = [
            TrendPoint(label=item.created_at.strftime("%a"), score=item.ats_score)
            for item in reversed(analyses)
        ]
        if not trend:
            trend = [
                TrendPoint(label="Mon", score=0),
                TrendPoint(label="Tue", score=0),
                TrendPoint(label="Wed", score=0),
            ]

        activity_query = await session.execute(
            select(ActivityLog)
            .where(ActivityLog.user_id == user.id)
            .order_by(ActivityLog.created_at.desc())
            .limit(6)
        )
        now = datetime.now(UTC)
        activity = []
        for entry in activity_query.scalars().all():
            minutes = max(int((now - entry.created_at.replace(tzinfo=UTC)).total_seconds() // 60), 0)
            label = f"{minutes}m ago" if minutes < 60 else f"{minutes // 60}h ago"
            activity.append(ActivityItem(title=entry.action.replace("_", " ").title(), detail=entry.detail, time=label))

        skill_heatmap = [
            SkillHeatmapItem(skill="TypeScript", level=88),
            SkillHeatmapItem(skill="FastAPI", level=74),
            SkillHeatmapItem(skill="OpenAI", level=83),
            SkillHeatmapItem(skill="PostgreSQL", level=70),
            SkillHeatmapItem(skill="Docker", level=79),
        ]

        return DashboardOverviewResponse(
            total_resumes=total_resumes,
            ats_average=ats_average,
            matches_generated=max(len(analyses) * 3, 0),
            interviews_secured=max(len(analyses) // 2, 0),
            trend=trend,
            activity=activity,
            skill_heatmap=skill_heatmap,
        )


dashboard_service = DashboardService()
