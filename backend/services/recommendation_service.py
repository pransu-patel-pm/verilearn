"""
Recommendation Service — Aggregates weak topics and generates
personalized learning recommendations.
"""

from typing import List, Dict
from collections import Counter


def aggregate_weak_topics_from_list(
    topic_lists: List[List[str]],
) -> List[Dict[str, int]]:
    """
    Aggregate weak topics from a list of topic lists.

    Args:
        topic_lists: e.g. [["Recursion", "DP"], ["DP", "Graphs"]]

    Returns:
        Sorted list of {topic, count} from most to least frequent.
    """
    all_topics: list[str] = []
    for topics in topic_lists:
        all_topics.extend(topics)

    counter = Counter(all_topics)
    return [
        {"topic": topic, "count": count}
        for topic, count in counter.most_common()
    ]


def get_most_weak_topic(topic_summary: List[Dict[str, int]]) -> str:
    """Return the single most frequently weak topic."""
    if not topic_summary:
        return "None identified"
    return topic_summary[0]["topic"]


def get_strongest_topic(
    topic_averages: List[Dict[str, float]],
) -> str:
    """Return the topic with highest average score."""
    if not topic_averages:
        return "None identified"
    best = max(topic_averages, key=lambda x: x.get("avg", 0))
    return best.get("topic", "Unknown")


def compute_performance_distribution(
    scores: List[float],
) -> Dict[str, int]:
    """
    Categorize scores into High (>=80), Medium (60–79), Low (<60).
    """
    distribution = {"high": 0, "medium": 0, "low": 0}
    for score in scores:
        if score >= 80:
            distribution["high"] += 1
        elif score >= 60:
            distribution["medium"] += 1
        else:
            distribution["low"] += 1
    return distribution


def generate_intervention_suggestions(
    weak_topics: List[str],
    ai_dependency: float,
    growth_trend: float,
) -> List[Dict[str, str]]:
    """
    Generate AI-powered intervention suggestions based on
    student's weak areas, AI dependency, and growth trend.
    """
    suggestions = []

    if ai_dependency > 50:
        suggestions.append({
            "title": "Reduce AI Dependency",
            "description": (
                "This student shows high AI dependency. Recommend in-person "
                "assessments or handwritten problem solving sessions to verify "
                "genuine understanding."
            ),
        })

    if growth_trend < 0:
        suggestions.append({
            "title": "Declining Performance",
            "description": (
                "Performance is trending downward. Consider a one-on-one "
                "session to identify blockers and adjust the learning pace."
            ),
        })

    for topic in weak_topics[:2]:
        suggestions.append({
            "title": f"Focus on {topic}",
            "description": (
                f"Consistently weak in {topic}. Recommend targeted exercises, "
                f"peer tutoring, or supplementary materials for this topic."
            ),
        })

    if not suggestions:
        suggestions.append({
            "title": "Maintain Current Pace",
            "description": (
                "Student is performing well. Encourage deeper exploration "
                "of advanced topics to maintain engagement."
            ),
        })

    return suggestions
