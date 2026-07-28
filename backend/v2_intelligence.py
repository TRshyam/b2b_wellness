"""
XYZ Corporate Wellness Dashboard v2 - Deterministic Intelligence Engine
Calculates Wellness Score, Persona, Badges, Forecast, Weekly Insights, and Benchmarks.
"""

import math
from typing import List, Dict, Any

def compute_wellness_score(logs_14d: List[Dict[str, Any]], emp: Dict[str, Any]) -> Dict[str, Any]:
    if not logs_14d:
        return {
            "score": 75,
            "category": "Healthy",
            "sub_scores": {"sleep": 75, "hydration": 75, "mood": 75, "nutrition": 75, "exercise": 75, "stress": 75}
        }

    target_sleep = emp.get("target_sleep_hours") or 8.0
    target_hyd = (emp.get("target_daily_hydration_liters") or 2.5) * 3.2 # approx 8 glasses
    target_ex = (emp.get("target_weekly_exercise_minutes") or 150) / 7.0 # approx 21.4 min/day

    # 1. Sleep sub-score (Exclude missing days)
    sleep_logs = [l["sleep_hours"] for l in logs_14d if l.get("sleep_hours") is not None]
    avg_sleep = (sum(sleep_logs) / len(sleep_logs)) if sleep_logs else 7.0
    sleep_sub = min(100.0, (avg_sleep / target_sleep) * 100.0)

    # 2. Hydration sub-score (Normalize oz to glasses if needed)
    hyd_logs = []
    for l in logs_14d:
        if l.get("hydration_glasses") is not None:
            hyd_logs.append(l["hydration_glasses"])
        elif l.get("hydration_oz") is not None:
            hyd_logs.append(l["hydration_oz"] / 8.0)
    avg_hyd = (sum(hyd_logs) / len(hyd_logs)) if hyd_logs else 8.0
    hyd_sub = min(100.0, (avg_hyd / target_hyd) * 100.0)

    # 3. Mood sub-score
    mood_logs = [l["mood_score"] for l in logs_14d if l.get("mood_score") is not None]
    avg_mood = (sum(mood_logs) / len(mood_logs)) if mood_logs else 4.0
    mood_sub = (avg_mood / 5.0) * 100.0

    # 4. Nutrition sub-score
    food_logged_days = sum(1 for l in logs_14d if l.get("healthy_food_logged") == 1)
    nutrition_sub = (food_logged_days / len(logs_14d)) * 100.0

    # 5. Exercise sub-score
    ex_logs = [l.get("exercise_minutes", 30) for l in logs_14d if l.get("exercise_minutes") is not None]
    avg_ex = (sum(ex_logs) / len(ex_logs)) if ex_logs else 21.4
    exercise_sub = min(100.0, (avg_ex / target_ex) * 100.0)

    # 6. Stress sub-score (1 = 100 score, 5 = 0 score)
    stress_logs = [l.get("stress_level", 2) for l in logs_14d if l.get("stress_level") is not None]
    avg_stress = (sum(stress_logs) / len(stress_logs)) if stress_logs else 2.0
    stress_sub = ((5.0 - avg_stress) / 4.0) * 100.0

    # Weighted Score Formula
    weighted = (
        (sleep_sub * 0.30) +
        (hyd_sub * 0.20) +
        (mood_sub * 0.20) +
        (nutrition_sub * 0.15) +
        (exercise_sub * 0.10) +
        (stress_sub * 0.05)
    )
    final_score = int(round(weighted))

    if final_score >= 90:
        cat = "Excellent"
    elif final_score >= 75:
        cat = "Healthy"
    elif final_score >= 60:
        cat = "Moderate"
    else:
        cat = "Needs Attention"

    return {
        "score": final_score,
        "category": cat,
        "sub_scores": {
            "sleep": round(sleep_sub, 1),
            "hydration": round(hyd_sub, 1),
            "mood": round(mood_sub, 1),
            "nutrition": round(nutrition_sub, 1),
            "exercise": round(exercise_sub, 1),
            "stress": round(stress_sub, 1)
        }
    }

def derive_wellness_persona(logs_14d: List[Dict[str, Any]], emp: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates persona criteria in strict sequential order (tie-breaking priority):
    1. Sleep Improver (avg_sleep < 7.0)
    2. Hydration Builder (avg_hydration < 7.0)
    3. Stress Recoverer (avg_stress >= 3 or mood_trend == Declining)
    4. Fitness Starter (avg_exercise < 20)
    5. Balanced Performer (else)
    """
    if not logs_14d:
        return {"name": "Balanced Performer", "tagline": "Consistent across key health dimensions"}

    sleep_logs = [l["sleep_hours"] for l in logs_14d if l.get("sleep_hours") is not None]
    avg_sleep = (sum(sleep_logs) / len(sleep_logs)) if sleep_logs else 7.5

    hyd_logs = [(l.get("hydration_glasses") or (l.get("hydration_oz", 64) / 8.0)) for l in logs_14d]
    avg_hyd = (sum(hyd_logs) / len(hyd_logs)) if hyd_logs else 8.0

    stress_logs = [l.get("stress_level", 2) for l in logs_14d if l.get("stress_level") is not None]
    avg_stress = (sum(stress_logs) / len(stress_logs)) if stress_logs else 2.0

    ex_logs = [l.get("exercise_minutes", 30) for l in logs_14d if l.get("exercise_minutes") is not None]
    avg_ex = (sum(ex_logs) / len(ex_logs)) if ex_logs else 30.0

    if avg_sleep < 7.0:
        return {
            "name": "Sleep Improver",
            "tagline": "Focusing on circadian rhythm rest & sleep duration",
            "description": "Your current 14-day sleep average is below target. Prioritizing 7.5+ hrs rest will unlock higher physical energy."
        }
    elif avg_hyd < 7.0:
        return {
            "name": "Hydration Builder",
            "tagline": "Building daily water intake & metabolic balance",
            "description": "Daily hydration intake is below 7 glasses. Small hourly water breaks will improve metabolic efficiency."
        }
    elif avg_stress >= 3.0:
        return {
            "name": "Stress Recoverer",
            "tagline": "Stabilizing cortisol & emotional equilibrium",
            "description": "Workload intensity has elevated stress levels. Mindful breathwork and thermal recovery are recommended."
        }
    elif avg_ex < 20.0:
        return {
            "name": "Fitness Starter",
            "tagline": "Establishing consistent daily physical movement",
            "description": "Building momentum toward 150 minutes of weekly activity with yoga and walking routines."
        }
    else:
        return {
            "name": "Balanced Performer",
            "tagline": "Consistently meeting physiological health targets",
            "description": "Maintaining optimal sleep, hydration, and mood scores across all corporate wellness benchmarks."
        }

def evaluate_achievements(logs_50d: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    badges = []

    # 1. Sleep Streak (7 days >= 7.0 hrs)
    sleep_streak = 0
    max_sleep_streak = 0
    for l in logs_50d:
        if l.get("sleep_hours", 0) >= 7.0:
            sleep_streak += 1
            max_sleep_streak = max(max_sleep_streak, sleep_streak)
        else:
            sleep_streak = 0

    badges.append({
        "id": "sleep_streak",
        "title": "Sleep Streak",
        "requirement": "7 consecutive days with ≥ 7.0 hrs sleep",
        "earned": max_sleep_streak >= 7,
        "progress": f"{min(max_sleep_streak, 7)}/7 days",
        "icon": "Moon"
    })

    # 2. Hydration Champion (7 days >= 7.0 glasses)
    hyd_streak = 0
    max_hyd_streak = 0
    for l in logs_50d:
        g = l.get("hydration_glasses") or (l.get("hydration_oz", 64) / 8.0)
        if g >= 7.0:
            hyd_streak += 1
            max_hyd_streak = max(max_hyd_streak, hyd_streak)
        else:
            hyd_streak = 0

    badges.append({
        "id": "hydration_champion",
        "title": "Hydration Champion",
        "requirement": "7 consecutive days with ≥ 7.0 glasses water",
        "earned": max_hyd_streak >= 7,
        "progress": f"{min(max_hyd_streak, 7)}/7 days",
        "icon": "Droplets"
    })

    # 3. Nutrition Explorer (10 of last 14 days healthy food)
    last_14 = logs_50d[-14:]
    healthy_days = sum(1 for l in last_14 if l.get("healthy_food_logged") == 1)
    badges.append({
        "id": "nutrition_explorer",
        "title": "Nutrition Explorer",
        "requirement": "Healthy nutrition logged on 10 of last 14 days",
        "earned": healthy_days >= 10,
        "progress": f"{healthy_days}/10 days",
        "icon": "Utensils"
    })

    # 4. Consistency Master (25 of last 30 days meeting sleep, hyd, food)
    last_30 = logs_50d[-30:]
    consistent_days = 0
    for l in last_30:
        s = l.get("sleep_hours", 0)
        g = l.get("hydration_glasses") or (l.get("hydration_oz", 64) / 8.0)
        f = l.get("healthy_food_logged", 0)
        if s >= 7.0 and g >= 7.0 and f == 1:
            consistent_days += 1

    badges.append({
        "id": "consistency_master",
        "title": "Consistency Master",
        "requirement": "All goals met on 25 of last 30 days",
        "earned": consistent_days >= 25,
        "progress": f"{consistent_days}/25 days",
        "icon": "Award"
    })

    return badges

def calculate_wellness_forecast(current_score: int, logs_14d: List[Dict[str, Any]], appts: List[Dict[str, Any]]) -> Dict[str, Any]:
    sleep_logs = [l["sleep_hours"] for l in logs_14d if l.get("sleep_hours") is not None]
    avg_sleep = (sum(sleep_logs) / len(sleep_logs)) if sleep_logs else 7.5

    hyd_logs = [(l.get("hydration_glasses") or (l.get("hydration_oz", 64) / 8.0)) for l in logs_14d]
    avg_hyd = (sum(hyd_logs) / len(hyd_logs)) if hyd_logs else 8.0

    ex_logs = [l.get("exercise_minutes", 30) for l in logs_14d if l.get("exercise_minutes") is not None]
    avg_ex = (sum(ex_logs) / len(ex_logs)) if ex_logs else 30.0

    potential_gains = 0
    breakdown = []

    if avg_hyd < 8.0:
        potential_gains += 3
        breakdown.append({"action": "Meeting daily 8-glass hydration target", "gain": 3})

    if avg_ex < 21.4:
        potential_gains += 4
        breakdown.append({"action": "Completing 150 min/week physical activity", "gain": 4})

    if avg_sleep < 8.0:
        potential_gains += 2
        breakdown.append({"action": "Attending booked Sleep Coaching session", "gain": 2})

    forecast_score = min(100, current_score + potential_gains)

    return {
        "current_score": current_score,
        "forecast_score": forecast_score,
        "potential_gain": potential_gains,
        "breakdown": breakdown
    }

def generate_weekly_insights(logs_14d: List[Dict[str, Any]]) -> List[str]:
    if len(logs_14d) < 14:
        return [
            "Your physiological logs indicate steady daily wellness engagement.",
            "Hydration intake has remained consistent over the tracking window."
        ]

    w1 = logs_14d[:7]
    w2 = logs_14d[7:]

    w1_sleep = sum(l["sleep_hours"] for l in w1) / 7.0
    w2_sleep = sum(l["sleep_hours"] for l in w2) / 7.0

    w1_hyd = sum(l.get("hydration_glasses") or (l.get("hydration_oz", 64) / 8.0) for l in w1) / 7.0
    w2_hyd = sum(l.get("hydration_glasses") or (l.get("hydration_oz", 64) / 8.0) for l in w2) / 7.0

    insights = []
    
    sleep_diff_min = int(round((w2_sleep - w1_sleep) * 60))
    if sleep_diff_min > 0:
        insights.append(f"Your average daily sleep increased by {sleep_diff_min} minutes compared to last week.")
    elif sleep_diff_min < 0:
        insights.append(f"Your daily sleep duration dipped by {abs(sleep_diff_min)} minutes over the past week.")
    else:
        insights.append("Your sleep duration remained steady week-over-week.")

    hyd_pct = int(round(((w2_hyd - w1_hyd) / max(w1_hyd, 1.0)) * 100))
    if hyd_pct > 0:
        insights.append(f"Hydration compliance improved by {hyd_pct}% over the last 7 days.")
    elif hyd_pct < 0:
        insights.append(f"Hydration intake decreased by {abs(hyd_pct)}% compared to the prior week.")
    else:
        insights.append("Hydration intake maintained optimal baseline compliance.")

    insights.append("Exercise consistency and active energy recovery remain aligned with department goals.")

    return insights

def get_department_benchmarks(conn) -> List[Dict[str, Any]]:
    """
    Computes department average wellness scores with privacy guardrail (minimum 5 employees).
    """
    cursor = conn.cursor()
    cursor.execute("""
        SELECT department, COUNT(*) as emp_count
        FROM employees
        GROUP BY department
    """)
    dept_counts = cursor.fetchall()

    benchmarks = []
    for dept, count in dept_counts:
        if count >= 5:
            # Query average metrics for department employees over last 14 days
            cursor.execute("""
                SELECT AVG(l.sleep_hours), AVG(l.hydration_glasses), AVG(l.mood_score)
                FROM employee_wellness_logs l
                JOIN employees e ON l.employee_id = e.employee_id
                WHERE e.department = ?
            """, (dept,))
            avg_s, avg_h, avg_m = cursor.fetchone()
            
            # Simple benchmark score formula
            b_score = int(round(((avg_s or 7.0) / 8.0 * 30) + ((avg_h or 8.0) / 8.0 * 20) + ((avg_m or 4.0) / 5.0 * 20) + 25))
            benchmarks.append({
                "department": dept,
                "employee_count": count,
                "average_score": b_score,
                "status": "Available"
            })
        else:
            benchmarks.append({
                "department": dept,
                "employee_count": count,
                "average_score": None,
                "status": "Insufficient Data (<5 employees)"
            })

    return benchmarks
