"""
Student Routes — Assignment submission, dashboard, results (PostgreSQL + JWT Auth).
"""

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from database.connection import get_db
from models.user_model import User
from models.assignment_model import (
    Assignment,
    AssignmentSubmit,
    FollowUpResponsePayload,
    AssignmentResultResponse,
    DashboardResponse,
    ScoreBreakdown,
    RadarScores,
    BookRecommendation,
)
from services.ai_service import (
    generate_followup_questions,
    evaluate_understanding,
    extract_weak_topics,
    recommend_books,
    calculate_ai_dependency,
)
from services.scoring_service import (
    calculate_final_score,
    build_radar_scores,
    compute_growth_trend,
)
from services.recommendation_service import aggregate_weak_topics_from_list
from routes.deps import require_student

router = APIRouter(prefix="/student", tags=["Student"])


# ---------- Helpers ----------

def _assignment_to_scores(a: Assignment) -> ScoreBreakdown:
    return ScoreBreakdown(
        concept_clarity=a.concept_clarity,
        application=a.application,
        logical_consistency=a.logical_consistency,
        depth=a.depth,
        final_score=a.final_score,
    )


def _assignment_to_radar(a: Assignment) -> RadarScores:
    return RadarScores(
        clarity=a.radar_clarity,
        application=a.radar_application,
        logic=a.radar_logic,
        critical_thinking=a.radar_critical_thinking,
        retention=a.radar_retention,
    )


# ---------- Routes ----------


@router.post("/submit-assignment", status_code=status.HTTP_201_CREATED)
async def submit_assignment(
    payload: AssignmentSubmit,
    current_user: User = Depends(require_student),
    db: AsyncSession = Depends(get_db),
):
    """
    Submit an assignment for AI analysis.
    Requires student JWT authentication.
    """

    # Step 1: AI follow-up questions
    followup_questions = await generate_followup_questions(payload.text)

    # Step 2: Extract weak topics
    weak_topics = await extract_weak_topics(payload.text)

    # Step 3: Evaluate understanding
    eval_scores = await evaluate_understanding(payload.text, {})

    # Step 4: Calculate weighted scores
    score_breakdown = calculate_final_score(
        concept_clarity=eval_scores["concept_clarity"],
        application=eval_scores["application"],
        logical_consistency=eval_scores["logical_consistency"],
        depth=eval_scores.get("depth", 70),
    )

    radar = build_radar_scores(
        clarity=eval_scores.get("clarity", 75),
        application=eval_scores["application"],
        logic=eval_scores["logical_consistency"],
        critical_thinking=eval_scores.get("critical_thinking", 70),
        retention=eval_scores.get("retention", 72),
    )

    # Step 5: Book recommendations
    book_recs = await recommend_books(weak_topics)
    rec_dicts = [BookRecommendation(**r).model_dump() for r in book_recs]

    # Step 6: AI dependency
    ai_dep = await calculate_ai_dependency(payload.text, {})

    # Create assignment row
    assignment = Assignment(
        student_id=current_user.id,
        text=payload.text,
        subject=payload.subject,
        followup_questions=followup_questions,
        student_responses={},
        concept_clarity=score_breakdown.concept_clarity,
        application=score_breakdown.application,
        logical_consistency=score_breakdown.logical_consistency,
        depth=score_breakdown.depth,
        final_score=score_breakdown.final_score,
        radar_clarity=radar.clarity,
        radar_application=radar.application,
        radar_logic=radar.logic,
        radar_critical_thinking=radar.critical_thinking,
        radar_retention=radar.retention,
        weak_topics=weak_topics,
        recommendations=rec_dicts,
        ai_dependency_score=ai_dep,
        status="analyzed",
    )
    db.add(assignment)
    await db.flush()

    return {
        "message": "Assignment analyzed successfully",
        "assignment_id": assignment.id,
        "followup_questions": followup_questions,
        "scores": score_breakdown.model_dump(),
        "radar_scores": radar.model_dump(),
        "weak_topics": weak_topics,
        "recommendations": rec_dicts,
        "ai_dependency_score": ai_dep,
    }


@router.post("/submit-followup")
async def submit_followup(
    payload: FollowUpResponsePayload,
    current_user: User = Depends(require_student),
    db: AsyncSession = Depends(get_db),
):
    """Submit responses to AI follow-up questions. Re-evaluates understanding."""

    result = await db.execute(
        select(Assignment).where(
            Assignment.id == payload.assignment_id,
            Assignment.student_id == current_user.id,
        )
    )
    assignment = result.scalar_one_or_none()

    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found.",
        )

    eval_scores = await evaluate_understanding(assignment.text, payload.responses)

    score_breakdown = calculate_final_score(
        concept_clarity=eval_scores["concept_clarity"],
        application=eval_scores["application"],
        logical_consistency=eval_scores["logical_consistency"],
        depth=eval_scores.get("depth", 70),
    )

    radar = build_radar_scores(
        clarity=eval_scores.get("clarity", 75),
        application=eval_scores["application"],
        logic=eval_scores["logical_consistency"],
        critical_thinking=eval_scores.get("critical_thinking", 70),
        retention=eval_scores.get("retention", 72),
    )

    ai_dep = await calculate_ai_dependency(assignment.text, payload.responses)

    assignment.student_responses = payload.responses
    assignment.concept_clarity = score_breakdown.concept_clarity
    assignment.application = score_breakdown.application
    assignment.logical_consistency = score_breakdown.logical_consistency
    assignment.depth = score_breakdown.depth
    assignment.final_score = score_breakdown.final_score
    assignment.radar_clarity = radar.clarity
    assignment.radar_application = radar.application
    assignment.radar_logic = radar.logic
    assignment.radar_critical_thinking = radar.critical_thinking
    assignment.radar_retention = radar.retention
    assignment.ai_dependency_score = ai_dep
    assignment.status = "completed"
    assignment.updated_at = datetime.utcnow()

    return {
        "message": "Follow-up responses evaluated",
        "assignment_id": assignment.id,
        "scores": score_breakdown.model_dump(),
        "radar_scores": radar.model_dump(),
        "ai_dependency_score": ai_dep,
    }


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    current_user: User = Depends(require_student),
    db: AsyncSession = Depends(get_db),
):
    """Return student dashboard overview. Requires student JWT."""

    result = await db.execute(
        select(Assignment)
        .where(Assignment.student_id == current_user.id)
        .order_by(Assignment.created_at.asc())
    )
    assignments = result.scalars().all()

    if not assignments:
        return DashboardResponse(
            overall_score=0,
            total_assignments=0,
            score_history=[],
            weak_topic_summary=[],
            ai_dependency_score=0,
            growth_trend=0,
        )

    score_history = []
    score_values = []
    ai_deps = []
    all_weak: list[list[str]] = []

    for a in assignments:
        score_values.append(a.final_score)
        score_history.append({
            "date": a.created_at.isoformat() if a.created_at else "",
            "score": a.final_score,
        })
        ai_deps.append(a.ai_dependency_score)
        all_weak.append(a.weak_topics or [])

    weak_topic_summary = aggregate_weak_topics_from_list(all_weak)
    growth = compute_growth_trend(score_values)
    avg_ai_dep = sum(ai_deps) / len(ai_deps) if ai_deps else 0

    return DashboardResponse(
        overall_score=round(score_values[-1], 1) if score_values else 0,
        total_assignments=len(assignments),
        score_history=score_history,
        weak_topic_summary=weak_topic_summary,
        ai_dependency_score=round(avg_ai_dep, 1),
        growth_trend=growth,
    )


@router.get("/results/{assignment_id}", response_model=AssignmentResultResponse)
async def get_results(
    assignment_id: int,
    current_user: User = Depends(require_student),
    db: AsyncSession = Depends(get_db),
):
    """Return detailed results for a specific assignment."""

    result = await db.execute(
        select(Assignment).where(
            Assignment.id == assignment_id,
            Assignment.student_id == current_user.id,
        )
    )
    assignment = result.scalar_one_or_none()

    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found.",
        )

    return AssignmentResultResponse(
        assignment_id=assignment.id,
        status=assignment.status,
        scores=_assignment_to_scores(assignment),
        radar_scores=_assignment_to_radar(assignment),
        weak_topics=assignment.weak_topics or [],
        recommendations=assignment.recommendations or [],
        followup_questions=assignment.followup_questions or [],
        ai_dependency_score=assignment.ai_dependency_score,
        created_at=assignment.created_at.isoformat() if assignment.created_at else "",
    )
