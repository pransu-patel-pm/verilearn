"""
Scoring Service — Weighted scoring formula for understanding evaluation.

Final Score = 0.4 * Concept Clarity + 0.3 * Application
            + 0.2 * Logical Consistency + 0.1 * Depth
"""

from models.assignment_model import ScoreBreakdown, RadarScores


def calculate_final_score(
    concept_clarity: float,
    application: float,
    logical_consistency: float,
    depth: float,
) -> ScoreBreakdown:
    """
    Apply the weighted scoring formula and return a full breakdown.

    Weights:
        Concept Clarity      → 40%
        Application          → 30%
        Logical Consistency  → 20%
        Depth                → 10%
    """
    final = (
        0.4 * concept_clarity
        + 0.3 * application
        + 0.2 * logical_consistency
        + 0.1 * depth
    )

    return ScoreBreakdown(
        concept_clarity=round(concept_clarity, 1),
        application=round(application, 1),
        logical_consistency=round(logical_consistency, 1),
        depth=round(depth, 1),
        final_score=round(final, 1),
    )


def build_radar_scores(
    clarity: float,
    application: float,
    logic: float,
    critical_thinking: float,
    retention: float,
) -> RadarScores:
    """Build radar chart data from individual dimension scores."""
    return RadarScores(
        clarity=round(clarity, 1),
        application=round(application, 1),
        logic=round(logic, 1),
        critical_thinking=round(critical_thinking, 1),
        retention=round(retention, 1),
    )


def compute_growth_trend(score_history: list[float]) -> float:
    """
    Calculate growth trend as percentage change between
    first-half average and second-half average.

    Returns positive for improvement, negative for decline.
    """
    if len(score_history) < 2:
        return 0.0

    mid = len(score_history) // 2
    first_half = sum(score_history[:mid]) / mid
    second_half = sum(score_history[mid:]) / (len(score_history) - mid)

    if first_half == 0:
        return 0.0

    trend = ((second_half - first_half) / first_half) * 100
    return round(trend, 1)
