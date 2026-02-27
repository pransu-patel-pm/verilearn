"""
Teacher Routes — Class analytics, individual student analytics (PostgreSQL).
"""

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sql_func

from database.connection import get_db
from models.user_model import User
from models.assignment_model import (
    Assignment,
    ClassAnalyticsResponse,
    StudentAnalyticsResponse,
)
from services.scoring_service import compute_growth_trend, build_radar_scores
from services.recommendation_service import (
    aggregate_weak_topics_from_list,
    get_most_weak_topic,
    get_strongest_topic,
    compute_performance_distribution,
    generate_intervention_suggestions,
)

router = APIRouter(prefix="/teacher", tags=["Teacher"])


# ---------- Routes ----------


@router.get("/class-analytics", response_model=ClassAnalyticsResponse)
async def get_class_analytics(db: AsyncSession = Depends(get_db)):
    """
    Calculate and return class-wide analytics:
    - Class average score
    - Most weak / strongest topic
    - Performance distribution
    - Score trends
    - AI risk count
    """

    # Count students
    student_count_result = await db.execute(
        select(sql_func.count(User.id)).where(User.role == "student")
    )
    student_count = student_count_result.scalar() or 0

    # Get all assignments ordered by date
    result = await db.execute(
        select(Assignment).order_by(Assignment.created_at.asc())
    )
    all_assignments = result.scalars().all()

    if not all_assignments:
        return ClassAnalyticsResponse(
            class_average=0,
            total_students=student_count,
            most_weak_topic="No data",
            strongest_topic="No data",
            performance_distribution={"high": 0, "medium": 0, "low": 0},
            score_trend=[],
            topic_averages=[],
            ai_risk_students=0,
        )

    # Collect scores per student (latest score)
    student_latest_scores: dict[int, float] = {}
    all_scores: list[float] = []
    ai_risk_count = 0
    seen_ai_risk: set[int] = set()
    all_weak: list[list[str]] = []

    for a in all_assignments:
        student_latest_scores[a.student_id] = a.final_score
        all_scores.append(a.final_score)
        all_weak.append(a.weak_topics or [])

        if a.ai_dependency_score > 50 and a.student_id not in seen_ai_risk:
            ai_risk_count += 1
            seen_ai_risk.add(a.student_id)

    # Class average
    class_avg = sum(all_scores) / len(all_scores) if all_scores else 0

    # Weak topics
    weak_topic_summary = aggregate_weak_topics_from_list(all_weak)
    most_weak = get_most_weak_topic(weak_topic_summary)

    # Topic averages (by subject)
    topic_scores: dict[str, list[float]] = {}
    for a in all_assignments:
        subject = a.subject or "General"
        topic_scores.setdefault(subject, []).append(a.final_score)

    topic_averages = [
        {"topic": topic, "avg": round(sum(s) / len(s), 1)}
        for topic, s in topic_scores.items()
    ]
    strongest = get_strongest_topic(topic_averages)

    # Performance distribution
    latest_scores = list(student_latest_scores.values())
    distribution = compute_performance_distribution(latest_scores)

    # Score trend (group by date)
    score_trend: list[dict] = []
    date_scores: dict[str, list[float]] = {}
    for a in all_assignments:
        if a.created_at:
            date_key = a.created_at.strftime("%Y-%m-%d")
            date_scores.setdefault(date_key, []).append(a.final_score)

    for date, scores in date_scores.items():
        score_trend.append({
            "date": date,
            "avg": round(sum(scores) / len(scores), 1),
        })

    return ClassAnalyticsResponse(
        class_average=round(class_avg, 1),
        total_students=max(student_count, len(student_latest_scores)),
        most_weak_topic=most_weak,
        strongest_topic=strongest,
        performance_distribution=distribution,
        score_trend=score_trend,
        topic_averages=topic_averages,
        ai_risk_students=ai_risk_count,
    )


@router.get("/student/{student_id}", response_model=StudentAnalyticsResponse)
async def get_student_analytics(
    student_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Return in-depth analytics for a specific student:
    - Performance history
    - Topic mastery (radar)
    - AI risk score
    - Growth trend
    - Weak topic timeline
    - Intervention suggestions
    """

    # Find student
    user_result = await db.execute(
        select(User).where(User.id == student_id)
    )
    user = user_result.scalar_one_or_none()
    student_name = user.name if user else f"Student {student_id}"

    # Get assignments
    result = await db.execute(
        select(Assignment)
        .where(Assignment.student_id == student_id)
        .order_by(Assignment.created_at.asc())
    )
    assignments = result.scalars().all()

    if not assignments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No assignments found for this student.",
        )

    # Score history
    score_history: list[dict] = []
    score_values: list[float] = []
    ai_deps: list[float] = []
    all_weak_topics: list[str] = []

    for a in assignments:
        score_values.append(a.final_score)
        score_history.append({
            "date": a.created_at.isoformat() if a.created_at else "",
            "score": a.final_score,
        })
        ai_deps.append(a.ai_dependency_score)
        all_weak_topics.extend(a.weak_topics or [])

    # Latest radar scores
    latest = assignments[-1]
    radar = build_radar_scores(
        clarity=latest.radar_clarity,
        application=latest.radar_application,
        logic=latest.radar_logic,
        critical_thinking=latest.radar_critical_thinking,
        retention=latest.radar_retention,
    )

    # Growth trend
    growth = compute_growth_trend(score_values)

    # AI dependency average
    avg_ai_dep = sum(ai_deps) / len(ai_deps) if ai_deps else 0

    # Weak topic timeline
    topic_timeline: list[dict] = []
    for a in assignments:
        topics = a.weak_topics or []
        if topics and a.created_at:
            topic_timeline.append({
                "week": a.created_at.strftime("Week %U"),
                "topics": ", ".join(topics),
                "detail": f"Struggled with {topics[0]} in this assignment.",
            })

    # Unique weak topics
    unique_weak = list(dict.fromkeys(all_weak_topics))

    # Intervention suggestions
    suggestions = generate_intervention_suggestions(
        unique_weak, avg_ai_dep, growth
    )

    return StudentAnalyticsResponse(
        student_id=student_id,
        student_name=student_name,
        overall_score=round(score_values[-1], 1) if score_values else 0,
        growth_trend=growth,
        ai_dependency_score=round(avg_ai_dep, 1),
        score_history=score_history,
        radar_scores=radar,
        weak_topics=unique_weak,
        topic_timeline=topic_timeline,
        intervention_suggestions=suggestions,
    )
