"""
Deterministic Rule-Based Recommendation Engine for B2B Corporate Wellness Dashboard.
Fixed Priority Order: Sleep > Hydration > Mood > Fitness.
Capped at maximum 2 recommendations.

This module is designed as a standalone, pure function interface so that callers 
(FastAPI routes or background jobs) can later swap this implementation for an 
ML-based model without modifying their caller code.
"""

from typing import List, Dict, Any

def generate_recommendations(
    wellness_snapshot: Dict[str, Any],
    service_usage_90d: List[Dict[str, Any]],
    service_usage_30d: List[Dict[str, Any]],
    appointments: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Evaluates deterministic priority rules based on employee wellness data.
    
    Returns up to 2 recommendations ordered by priority:
    1. Sleep
    2. Hydration
    3. Mood
    4. Fitness
    """
    recommendations = []

    # Extract metrics from wellness snapshot
    avg_sleep = wellness_snapshot.get("avg_sleep_hours", 7.0)
    avg_hydration_glasses = wellness_snapshot.get("avg_hydration_glasses", 8.0)
    mood_trend = wellness_snapshot.get("mood_trend", "Stable") # "Declining", "Improving", "Stable"

    # Helper map for 30d usage counts by category
    usage_30d_counts = {item["category"]: item["count"] for item in service_usage_30d}

    # Count of sleep coaching appointments
    sleep_coaching_appts = sum(
        1 for appt in appointments 
        if appt.get("service_id") == 9 or "sleep" in appt.get("service_title", "").lower()
    )

    # ------------------------------------------------------------------------
    # PRIORITY 1: SLEEP RULES (Max 1 Sleep recommendation)
    # ------------------------------------------------------------------------
    if avg_sleep < 6.0:
        spa_sauna_usage = usage_30d_counts.get("thermal_spa", 0) + usage_30d_counts.get("sauna", 0)
        if spa_sauna_usage == 0:
            recommendations.append({
                "rule_id": "THERMAL_SPA_SAUNA",
                "priority": 1,
                "title": "Thermal Spa or Sauna Session",
                "action": "Book a Thermal Spa or Sauna session",
                "category": "thermal_spa",
                "justification": "Your sleep hours have dropped below 6/night for the past week — a Thermal Spa or Sauna session (last used: never) may help you unwind. Book a slot this week."
            })
        elif sleep_coaching_appts == 0:
            recommendations.append({
                "rule_id": "SLEEP_COACHING",
                "priority": 1,
                "title": "Sleep Coaching Consultation",
                "action": "Book a Sleep Coaching Consultation",
                "category": "diet_planning",
                "justification": "We noticed your sleep has averaged under 6 hours this past week, and you haven't utilized your Sleep Coaching benefits yet this year. A 30-minute session can help you build a better evening routine."
            })

    # ------------------------------------------------------------------------
    # PRIORITY 2: HYDRATION RULE
    # ------------------------------------------------------------------------
    if avg_hydration_glasses < 6.0 and len(recommendations) < 2:
        recommendations.append({
            "rule_id": "HYDRATION_CONSULT",
            "priority": 2,
            "title": "Nutrition & Hydration Consultation",
            "action": "Schedule a Nutrition Consultation",
            "category": "nutrition",
            "justification": "You haven't logged hydration consistently — try setting a daily reminder or check in with our Nutrition Consult team for a hydration plan."
        })

    # ------------------------------------------------------------------------
    # PRIORITY 3: MOOD RULE
    # ------------------------------------------------------------------------
    if mood_trend == "Declining" and len(recommendations) < 2:
        recommendations.append({
            "rule_id": "MOOD_MINDFULNESS",
            "priority": 3,
            "title": "Meditation & Mindful Leadership",
            "action": "Join a Meditation or Mindful Leadership Workshop",
            "category": "on_premise_events",
            "justification": "Your mood trend shows a recent dip over the past week — join a Mindful Leadership or Meditation session to reset."
        })

    # ------------------------------------------------------------------------
    # PRIORITY 4: FITNESS RULE
    # ------------------------------------------------------------------------
    yoga_fitness_usage = usage_30d_counts.get("yoga", 0)
    if yoga_fitness_usage == 0 and len(recommendations) < 2:
        recommendations.append({
            "rule_id": "FITNESS_YOGA",
            "priority": 4,
            "title": "Sunrise Vinyasa Yoga Session",
            "action": "Reserve a Yoga or Gym Session",
            "category": "yoga",
            "justification": "No fitness or yoga activities logged in the past 30 days — reserve a Sunrise Vinyasa session to boost your physical energy."
        })

    # Cap output to maximum 2 recommendations
    return recommendations[:2]
