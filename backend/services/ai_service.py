"""
AI Service — Placeholder functions for Gemini API integration.

All functions return structured mock data now but are designed to be
swapped with real Gemini API calls later. Each function signature and
return type is production-ready.
"""

from typing import List, Dict
import random


async def generate_followup_questions(text: str) -> List[Dict[str, str]]:
    """
    Generate AI-powered follow-up questions based on submitted text.

    In production: sends the text to Gemini and asks it to generate
    probing questions that test true understanding vs rote memorization.

    Returns:
        List of dicts with 'id' and 'question' keys.
    """
    questions = [
        {
            "id": "q1",
            "question": (
                "You mentioned a recursive approach. Can you explain what happens "
                "when the input size is zero? How does your base case handle it?"
            ),
        },
        {
            "id": "q2",
            "question": (
                "Your solution uses memoization. Can you describe the difference "
                "between top-down and bottom-up approaches, and why you chose this one?"
            ),
        },
        {
            "id": "q3",
            "question": (
                "If the constraints changed to handle negative numbers, how would "
                "your algorithm need to adapt?"
            ),
        },
    ]
    return questions


async def evaluate_understanding(
    text: str, responses: Dict[str, str]
) -> Dict[str, float]:
    """
    Evaluate the depth of understanding from original text + follow-up responses.

    In production: sends both to Gemini with a rubric prompt for scoring.

    Returns:
        Dict with score dimensions (0–100 each).
    """
    return {
        "concept_clarity": round(random.uniform(65, 95), 1),
        "application": round(random.uniform(60, 90), 1),
        "logical_consistency": round(random.uniform(70, 95), 1),
        "depth": round(random.uniform(55, 85), 1),
        "clarity": round(random.uniform(70, 95), 1),
        "critical_thinking": round(random.uniform(60, 90), 1),
        "retention": round(random.uniform(65, 92), 1),
    }


async def extract_weak_topics(text: str) -> List[str]:
    """
    Identify conceptual gaps and weak topics from submitted text.

    In production: Gemini analyzes the text for misconceptions,
    surface-level explanations, and missing fundamentals.

    Returns:
        List of topic strings where the student shows weakness.
    """
    all_topics = [
        "Recursion",
        "Dynamic Programming",
        "Graph Theory",
        "Data Structures",
        "Sorting Algorithms",
        "Trees & BST",
        "Time Complexity",
        "Memory Management",
        "Object-Oriented Design",
        "Database Normalization",
    ]
    count = random.randint(2, 4)
    return random.sample(all_topics, count)


async def recommend_books(weak_topics: List[str]) -> List[Dict[str, str]]:
    """
    Generate personalized book recommendations based on weak topics.

    In production: Gemini matches weak areas to curated book database
    or generates recommendations dynamically.

    Returns:
        List of book recommendation dicts.
    """
    book_pool = {
        "Recursion": {
            "title": "Structure and Interpretation of Computer Programs",
            "author": "Abelson & Sussman",
        },
        "Dynamic Programming": {
            "title": "Introduction to Algorithms",
            "author": "Thomas H. Cormen",
        },
        "Graph Theory": {
            "title": "Graph Theory with Applications",
            "author": "Bondy & Murty",
        },
        "Data Structures": {
            "title": "Data Structures and Algorithm Analysis",
            "author": "Mark Allen Weiss",
        },
        "Sorting Algorithms": {
            "title": "The Art of Computer Programming Vol. 3",
            "author": "Donald Knuth",
        },
        "Trees & BST": {
            "title": "Algorithms in Java",
            "author": "Robert Sedgewick",
        },
        "Time Complexity": {
            "title": "Algorithm Design Manual",
            "author": "Steven Skiena",
        },
        "Memory Management": {
            "title": "Computer Systems: A Programmer's Perspective",
            "author": "Bryant & O'Hallaron",
        },
        "Object-Oriented Design": {
            "title": "Clean Code",
            "author": "Robert C. Martin",
        },
        "Database Normalization": {
            "title": "Database System Concepts",
            "author": "Silberschatz, Korth & Sudarshan",
        },
    }

    recommendations = []
    for topic in weak_topics:
        if topic in book_pool:
            book = book_pool[topic]
            recommendations.append(
                {
                    "title": book["title"],
                    "author": book["author"],
                    "topic": topic,
                    "match_percentage": random.randint(78, 96),
                }
            )

    # Always return at least 3 recommendations
    if len(recommendations) < 3:
        fallbacks = [
            {
                "title": "Cracking the Coding Interview",
                "author": "Gayle Laakmann McDowell",
                "topic": "General CS",
                "match_percentage": 85,
            },
            {
                "title": "Grokking Algorithms",
                "author": "Aditya Bhargava",
                "topic": "Algorithms",
                "match_percentage": 80,
            },
        ]
        for fb in fallbacks:
            if len(recommendations) >= 3:
                break
            recommendations.append(fb)

    return recommendations


async def calculate_ai_dependency(text: str, responses: Dict[str, str]) -> float:
    """
    Estimate how likely the student relied on AI to generate their submission.

    In production: Gemini compares writing style, depth consistency,
    and response patterns between the original text and follow-up answers.

    Returns:
        Float 0–100 representing AI dependency risk percentage.
    """
    return round(random.uniform(10, 65), 1)
