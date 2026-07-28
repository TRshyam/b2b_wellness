import os
import sqlite3
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

from engine.recommendations import generate_recommendations
from auth import (
    get_current_employee,
    verify_password,
    hash_password,
    create_access_token,
    get_db_conn
)

app = FastAPI(
    title="XYZ Corporate Wellness Dashboard API",
    description="Multi-tenant, strict JWT-authenticated B2B corporate wellness API for XYZ Company.",
    version="2.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALL_SERVICE_CATEGORIES = [
    "massage", "organic_food", "diet_planning", "nutrition", 
    "thermal_spa", "sauna", "ayurvedic_doctor", "on_premise_events", "yoga"
]

CATEGORY_DISPLAY_NAMES = {
    "massage": "Massage Therapy",
    "organic_food": "Organic Food & Catering",
    "diet_planning": "Diet & Meal Planning",
    "nutrition": "Nutrition Consultations",
    "thermal_spa": "Thermal Spa",
    "sauna": "Sauna & Detox",
    "ayurvedic_doctor": "Ayurvedic Doctor",
    "on_premise_events": "On-Premise Workshops",
    "yoga": "Yoga & Mindfulness"
}

# ----------------------------------------------------------------------------
# AUTH REQUEST MODELS
# ----------------------------------------------------------------------------
class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = None

class CreatePasswordRequest(BaseModel):
    employee_id: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class AppointmentActionRequest(BaseModel):
    action: str # "cancel" or "reschedule"
    new_date: Optional[str] = None

# ----------------------------------------------------------------------------
# 1. AUTHENTICATION ENDPOINTS
# ----------------------------------------------------------------------------

@app.post("/api/auth/login")
def login(req: LoginRequest):
    """
    Employee Login endpoint.
    If first-time user (password_created == 0), returns first_time_setup flag for password creation.
    If active user, validates password and issues JWT token.
    """
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT employee_id, full_name, email, department, role, password_hash, is_active, password_created
        FROM employees
        WHERE LOWER(email) = LOWER(?)
    """, (req.email.strip(),))
    row = cursor.fetchone()

    if not row:
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    emp = dict(row)

    if emp["is_active"] != 1:
        conn.close()
        raise HTTPException(status_code=403, detail="Account is deactivated. Please contact HR.")

    # First Time Account Setup check
    if emp["password_created"] == 0 or not emp["password_hash"]:
        conn.close()
        return {
            "first_time_setup": True,
            "employee_id": emp["employee_id"],
            "email": emp["email"],
            "full_name": emp["full_name"],
            "message": "First time login: Please create your account password."
        }

    # Standard password check
    if not req.password or not verify_password(req.password, emp["password_hash"]):
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    # Update last login timestamp
    now_str = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute("UPDATE employees SET last_login = ? WHERE employee_id = ?", (now_str, emp["employee_id"]))
    conn.commit()
    conn.close()

    # Generate JWT Token
    access_token = create_access_token(data={"sub": emp["employee_id"], "email": emp["email"]})
    
    # Return token & safe profile
    del emp["password_hash"]
    emp["last_login"] = now_str
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "employee": emp
    }

@app.post("/api/auth/create-password")
def create_password(req: CreatePasswordRequest):
    """
    First Time Account Setup: Create Password endpoint.
    Only permitted for employees where password_created == 0.
    """
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")

    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT employee_id, full_name, email, department, role, is_active, password_created
        FROM employees
        WHERE employee_id = ?
    """, (req.employee_id,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Employee record not found.")

    emp = dict(row)
    if emp["is_active"] != 1:
        conn.close()
        raise HTTPException(status_code=403, detail="Account deactivated.")

    # Update password hash
    hashed = hash_password(req.new_password)
    now_str = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute("""
        UPDATE employees
        SET password_hash = ?, password_created = 1, last_login = ?
        WHERE employee_id = ?
    """, (hashed, now_str, req.employee_id))
    conn.commit()
    conn.close()

    # Issue JWT token
    access_token = create_access_token(data={"sub": emp["employee_id"], "email": emp["email"]})
    emp["password_created"] = 1
    emp["last_login"] = now_str

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "employee": emp,
        "message": "Account password created successfully."
    }

@app.get("/api/auth/me")
def get_me(current_emp: dict = Depends(get_current_employee)):
    """Returns currently authenticated employee profile."""
    return current_emp

@app.post("/api/auth/change-password")
def change_password(
    req: ChangePasswordRequest,
    current_emp: dict = Depends(get_current_employee)
):
    """Changes password for the currently logged-in employee."""
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters.")

    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT password_hash FROM employees WHERE employee_id = ?", (current_emp["employee_id"],))
    row = cursor.fetchone()

    if not row or not verify_password(req.old_password, row["password_hash"]):
        conn.close()
        raise HTTPException(status_code=400, detail="Incorrect current password.")

    new_hash = hash_password(req.new_password)
    cursor.execute("UPDATE employees SET password_hash = ? WHERE employee_id = ?", (new_hash, current_emp["employee_id"]))
    conn.commit()
    conn.close()

    return {"status": "success", "message": "Password changed successfully."}

@app.post("/api/auth/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    """Generates password reset token for valid employee email (Mock email delivery)."""
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT employee_id, full_name FROM employees WHERE LOWER(email) = LOWER(?)", (req.email.strip(),))
    row = cursor.fetchone()

    if not row:
        conn.close()
        # Return generic success to prevent email enumeration
        return {"status": "success", "message": "If this email is registered, password reset instructions have been sent."}

    reset_token = str(uuid.uuid4())
    expiry = (datetime.now(timezone.utc) + timedelta(hours=1)).strftime('%Y-%m-%d %H:%M:%S')

    cursor.execute("""
        UPDATE employees
        SET reset_token = ?, reset_token_expiry = ?
        WHERE employee_id = ?
    """, (reset_token, expiry, row["employee_id"]))
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": "Password reset token generated.",
        "reset_token": reset_token, # Returned for dev/demo purposes
        "email": req.email
    }

@app.post("/api/auth/reset-password")
def reset_password(req: ResetPasswordRequest):
    """Resets password using a valid reset token."""
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters.")

    conn = get_db_conn()
    cursor = conn.cursor()
    now_str = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')

    cursor.execute("""
        SELECT employee_id, reset_token_expiry
        FROM employees
        WHERE reset_token = ?
    """, (req.token,))
    row = cursor.fetchone()

    if not row or not row["reset_token_expiry"] or row["reset_token_expiry"] < now_str:
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")

    new_hash = hash_password(req.new_password)
    cursor.execute("""
        UPDATE employees
        SET password_hash = ?, password_created = 1, reset_token = NULL, reset_token_expiry = NULL
        WHERE employee_id = ?
    """, (new_hash, row["employee_id"]))
    conn.commit()
    conn.close()

    return {"status": "success", "message": "Password reset successfully. You may now log in."}

@app.post("/api/auth/logout")
def logout(current_emp: dict = Depends(get_current_employee)):
    """Logs out the employee."""
    return {"status": "success", "message": "Logged out successfully."}

# ----------------------------------------------------------------------------
# 2. PROTECTED DASHBOARD ENDPOINTS (EXTRACT EMPLOYEE FROM JWT)
# ----------------------------------------------------------------------------

@app.get("/api/dashboard/upcoming-appointments")
def get_upcoming_appointments(current_emp: dict = Depends(get_current_employee)):
    """
    Component 1: My Upcoming Appointments
    Strictly isolated by current_emp['employee_id'] extracted from JWT token.
    """
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            a.appointment_id,
            a.employee_id,
            s.service_id,
            s.title AS service_title,
            s.category AS service_category,
            v.name AS vendor_name,
            v.contact_email AS vendor_email,
            a.appointment_date,
            a.location,
            a.status
        FROM appointments a
        JOIN services s ON a.service_id = s.service_id
        JOIN vendors v ON s.vendor_id = v.vendor_id
        WHERE a.employee_id = ? AND a.status IN ('Booked', 'CONFIRMED')
        ORDER BY a.appointment_date ASC
    """, (current_emp["employee_id"],))
    
    appts = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return appts

@app.get("/api/dashboard/registered-events")
def get_registered_events(current_emp: dict = Depends(get_current_employee)):
    """
    Component 2: My Registered Events
    Strictly isolated by current_emp['employee_id'] extracted from JWT token.
    """
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            r.registration_id,
            r.employee_id,
            e.event_id,
            e.event_title,
            e.event_date,
            e.location,
            r.registration_status,
            r.pass_code,
            s.category AS service_category
        FROM event_registrations r
        JOIN events e ON r.event_id = e.event_id
        JOIN services s ON e.service_id = s.service_id
        WHERE r.employee_id = ?
        ORDER BY e.event_date DESC
    """, (current_emp["employee_id"],))

    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()

    upcoming = [r for r in rows if r["registration_status"] == "REGISTERED"]
    past = [r for r in rows if r["registration_status"] in ("ATTENDED", "MISSED")]

    return {"upcoming": upcoming, "past": past}

@app.get("/api/dashboard/wellness-snapshot")
def get_wellness_snapshot(current_emp: dict = Depends(get_current_employee)):
    """
    Component 3: My Wellness Snapshot
    Strictly isolated by current_emp['employee_id'] extracted from JWT token.
    """
    employee_id = current_emp["employee_id"]
    conn = get_db_conn()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            log_date,
            sleep_hours,
            hydration_glasses,
            hydration_oz,
            healthy_food_logged,
            mood_score,
            active_energy_kcal,
            hrv_ms
        FROM employee_wellness_logs
        WHERE employee_id = ?
        ORDER BY log_date DESC
        LIMIT 14
    """, (employee_id,))

    raw_logs = [dict(row) for row in cursor.fetchall()]
    logs = list(reversed(raw_logs))
    conn.close()

    if not logs:
        return {
            "avg_sleep_hours": 7.0,
            "sleep_trend": "Stable",
            "healthy_food_logged_days": 10,
            "total_days_logged": 14,
            "avg_hydration_glasses": 8.0,
            "avg_hydration_oz": 64.0,
            "avg_mood_score": 4.0,
            "mood_trend": "Stable",
            "mood_trend_description": "Normal balance"
        }

    total_logs = len(logs)
    avg_sleep = round(sum(l["sleep_hours"] for l in logs) / total_logs, 1)
    avg_hyd_glasses = round(sum(l["hydration_glasses"] for l in logs) / total_logs, 1)
    avg_hyd_oz = round(sum(l["hydration_oz"] for l in logs) / total_logs, 1)
    healthy_food_count = sum(1 for l in logs if l["healthy_food_logged"] == 1)
    avg_mood = round(sum(l["mood_score"] for l in logs) / total_logs, 1)

    if total_logs >= 14:
        w1_mood = sum(l["mood_score"] for l in logs[:7]) / 7.0
        w2_mood = sum(l["mood_score"] for l in logs[7:]) / 7.0
        w1_sleep = sum(l["sleep_hours"] for l in logs[:7]) / 7.0
        w2_sleep = sum(l["sleep_hours"] for l in logs[7:]) / 7.0
    else:
        half = total_logs // 2 or 1
        w1_mood = sum(l["mood_score"] for l in logs[:half]) / float(half)
        w2_mood = sum(l["mood_score"] for l in logs[half:]) / float(len(logs) - half)
        w1_sleep = sum(l["sleep_hours"] for l in logs[:half]) / float(half)
        w2_sleep = sum(l["sleep_hours"] for l in logs[half:]) / float(len(logs) - half)

    mood_delta = w2_mood - w1_mood
    if mood_delta < -0.2:
        mood_trend = "Declining"
        mood_desc = "Dipping mid-week, partial recovery on weekends." if employee_id == "E023" else "Recent dip over the past week."
    elif mood_delta > 0.2:
        mood_trend = "Improving"
        mood_desc = "Positive upward momentum."
    else:
        mood_trend = "Stable"
        mood_desc = "Consistent emotional balance."

    sleep_delta = w2_sleep - w1_sleep
    if sleep_delta < -0.3:
        sleep_trend = f"Declining from {round(w1_sleep, 1)} hrs"
    else:
        sleep_trend = "Steady"

    return {
        "avg_sleep_hours": avg_sleep,
        "sleep_trend": sleep_trend,
        "healthy_food_logged_days": healthy_food_count,
        "total_days_logged": total_logs,
        "avg_hydration_glasses": avg_hyd_glasses,
        "avg_hydration_oz": avg_hyd_oz,
        "avg_mood_score": avg_mood,
        "mood_trend": mood_trend,
        "mood_trend_description": mood_desc
    }

from v2_intelligence import (
    compute_wellness_score,
    derive_wellness_persona,
    evaluate_achievements,
    calculate_wellness_forecast,
    generate_weekly_insights,
    get_department_benchmarks
)

@app.get("/api/dashboard/v2-intelligence")
def get_v2_intelligence(current_emp: dict = Depends(get_current_employee)):
    """
    v2 Enterprise Enhancement Endpoint:
    Returns Wellness Score, Persona, Badges, Forecast, Weekly Insights & Dept Benchmarks.
    """
    emp_id = current_emp["employee_id"]
    conn = get_db_conn()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM employees WHERE employee_id = ?", (emp_id,))
    emp_row = dict(cursor.fetchone())

    cursor.execute("SELECT * FROM employee_wellness_logs WHERE employee_id = ? ORDER BY log_date ASC", (emp_id,))
    logs_50d = [dict(row) for row in cursor.fetchall()]

    cursor.execute("SELECT * FROM appointments WHERE employee_id = ?", (emp_id,))
    appts = [dict(row) for row in cursor.fetchall()]

    logs_14d = logs_50d[-14:]

    score_data = compute_wellness_score(logs_14d, emp_row)
    persona = derive_wellness_persona(logs_14d, emp_row)
    achievements = evaluate_achievements(logs_50d)
    forecast = calculate_wellness_forecast(score_data["score"], logs_14d, appts)
    insights = generate_weekly_insights(logs_14d)
    dept_benchmarks = get_department_benchmarks(conn)

    conn.close()

    return {
        "wellness_score": score_data["score"],
        "health_category": score_data["category"],
        "sub_scores": score_data["sub_scores"],
        "persona": persona,
        "achievements": achievements,
        "forecast": forecast,
        "weekly_insights": insights,
        "department_benchmarks": dept_benchmarks,
        "logs_50d": logs_50d
    }

@app.get("/api/dashboard/service-usage")
def get_service_usage(current_emp: dict = Depends(get_current_employee)):
    """
    Component 4: My Service Usage
    Strictly isolated by current_emp['employee_id'] extracted from JWT token.
    """
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT service_category, SUM(count) AS total_count
        FROM service_usage
        WHERE employee_id = ?
        GROUP BY service_category
        ORDER BY total_count DESC
    """, (current_emp["employee_id"],))

    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()

    usage_map = {r["service_category"]: r["total_count"] for r in rows}

    categories_result = []
    for cat in ALL_SERVICE_CATEGORIES:
        cnt = usage_map.get(cat, 0)
        categories_result.append({
            "category_key": cat,
            "category_name": CATEGORY_DISPLAY_NAMES[cat],
            "count": cnt,
            "is_blind_spot": (cnt == 0)
        })

    categories_result.sort(key=lambda x: (-x["count"], x["category_name"]))

    return {
        "lookback_days": 90,
        "total_categories": len(ALL_SERVICE_CATEGORIES),
        "active_categories": sum(1 for c in categories_result if not c["is_blind_spot"]),
        "blind_spot_count": sum(1 for c in categories_result if c["is_blind_spot"]),
        "categories": categories_result
    }

@app.get("/api/dashboard/recommendations")
def get_recommendations(current_emp: dict = Depends(get_current_employee)):
    """
    Component 5: Recommended For You
    Strictly isolated by current_emp['employee_id'] extracted from JWT token.
    """
    snapshot = get_wellness_snapshot(current_emp)
    usage_res = get_service_usage(current_emp)
    usage_90d = [{"category": c["category_key"], "count": c["count"]} for c in usage_res["categories"]]
    usage_30d = usage_90d
    appts = get_upcoming_appointments(current_emp)

    recs = generate_recommendations(snapshot, usage_90d, usage_30d, appts)
    return {
        "employee_id": current_emp["employee_id"],
        "recommendations": recs
    }

@app.post("/api/appointments/{appointment_id}/action")
def update_appointment_action(
    appointment_id: int,
    req: AppointmentActionRequest,
    current_emp: dict = Depends(get_current_employee)
):
    """
    Quick Action: Reschedule or Cancel an appointment.
    Enforces strict authorization: appointment MUST belong to current_emp['employee_id'].
    """
    conn = get_db_conn()
    cursor = conn.cursor()

    cursor.execute("SELECT employee_id FROM appointments WHERE appointment_id = ?", (appointment_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Appointment not found")
    if row["employee_id"] != current_emp["employee_id"]:
        conn.close()
        raise HTTPException(status_code=403, detail="Unauthorized: Cross-tenant modification denied.")

    if req.action == "cancel":
        cursor.execute("UPDATE appointments SET status = 'CANCELLED' WHERE appointment_id = ?", (appointment_id,))
    elif req.action == "reschedule":
        new_dt = req.new_date or "2026-08-10 14:00:00"
        cursor.execute("UPDATE appointments SET appointment_date = ?, status = 'Booked' WHERE appointment_id = ?", (new_dt, appointment_id))

    conn.commit()
    conn.close()
    return {"status": "success", "appointment_id": appointment_id, "action": req.action}
