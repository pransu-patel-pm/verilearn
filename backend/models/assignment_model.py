"""
Assignment ORM model + Pydantic schemas for requests/responses.
"""

from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON, func,
)
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

from database.connection import Base


# ==================== ORM Model ====================

class Assignment(Base):
    """assignments table."""
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    text = Column(Text, nullable=False)
    subject = Column(String(100), default="General")

    # AI-generated follow-up questions: [{"id": "q1", "question": "..."}]
    followup_questions = Column(JSON, default=list)

    # Student responses to follow-ups: {"q1": "answer..."}
    student_responses = Column(JSON, default=dict)

    # Scores
    concept_clarity = Column(Float, default=0)
    application = Column(Float, default=0)
    logical_consistency = Column(Float, default=0)
    depth = Column(Float, default=0)
    final_score = Column(Float, default=0)

    # Radar chart dimensions
    radar_clarity = Column(Float, default=0)
    radar_application = Column(Float, default=0)
    radar_logic = Column(Float, default=0)
    radar_critical_thinking = Column(Float, default=0)
    radar_retention = Column(Float, default=0)

    # Analysis results
    weak_topics = Column(JSON, default=list)        # ["Recursion", "DP"]
    recommendations = Column(JSON, default=list)     # [{title, author, topic, match}]
    ai_dependency_score = Column(Float, default=0)

    status = Column(String(20), default="submitted")  # submitted | analyzed | completed

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# ==================== Analytics ORM Model ====================

class Analytics(Base):
    """analytics table — stores precomputed class/student analytics snapshots."""
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    analytics_type = Column(String(50), nullable=False)  # "class" or "student"
    data = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ==================== Request Schemas ====================

class AssignmentSubmit(BaseModel):
    """Student assignment submission payload."""
    text: str = Field(..., min_length=20, description="Assignment text to analyze")
    subject: str = Field(default="General", max_length=100)


class FollowUpResponsePayload(BaseModel):
    """Student's response to AI follow-up questions."""
    assignment_id: int
    responses: Dict[str, str] = Field(
        ..., description="Map of question_id -> student answer"
    )


# ==================== Score Models ====================

class ScoreBreakdown(BaseModel):
    """Detailed score components."""
    concept_clarity: float = Field(..., ge=0, le=100)
    application: float = Field(..., ge=0, le=100)
    logical_consistency: float = Field(..., ge=0, le=100)
    depth: float = Field(..., ge=0, le=100)
    final_score: float = Field(..., ge=0, le=100)


class RadarScores(BaseModel):
    """Radar chart dimensions."""
    clarity: float = 0
    application: float = 0
    logic: float = 0
    critical_thinking: float = 0
    retention: float = 0


class BookRecommendation(BaseModel):
    """A single book recommendation."""
    title: str
    author: str
    topic: str
    match_percentage: int = Field(..., ge=0, le=100)


# ==================== Response Schemas ====================

class AssignmentResultResponse(BaseModel):
    """Full assignment result returned to the student."""
    assignment_id: int
    status: str
    scores: ScoreBreakdown
    radar_scores: RadarScores
    weak_topics: List[str] = []
    recommendations: List[BookRecommendation] = []
    followup_questions: List[Dict[str, str]] = []
    ai_dependency_score: float = 0.0
    created_at: str

    class Config:
        from_attributes = True


class DashboardResponse(BaseModel):
    """Student dashboard overview."""
    overall_score: float
    total_assignments: int
    score_history: List[Dict[str, float]]
    weak_topic_summary: List[Dict[str, int]]
    ai_dependency_score: float
    growth_trend: float


class ClassAnalyticsResponse(BaseModel):
    """Teacher class-wide analytics."""
    class_average: float
    total_students: int
    most_weak_topic: str
    strongest_topic: str
    performance_distribution: Dict[str, int]
    score_trend: List[Dict[str, float]]
    topic_averages: List[Dict[str, float]]
    ai_risk_students: int


class StudentAnalyticsResponse(BaseModel):
    """Individual student analytics for teachers."""
    student_id: int
    student_name: str
    overall_score: float
    growth_trend: float
    ai_dependency_score: float
    score_history: List[Dict[str, float]]
    radar_scores: Optional[RadarScores] = None
    weak_topics: List[str] = []
    topic_timeline: List[Dict[str, str]] = []
    intervention_suggestions: List[Dict[str, str]] = []
