"""
XYZ Corporate Wellness Dashboard - Schema Enrichment & Migration Script
Phases 1, 2, 3: Metadata Enhancement without breaking existing schemas/APIs
"""

import sqlite3
import random
from datetime import datetime, timedelta

DB_PATH = "/home/shyam/Desktop/Codind/b2b_wellness/backend/database/wellness.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def add_column_if_not_exists(cursor, table, col_name, col_type, default_val=None):
    cursor.execute(f"PRAGMA table_info({table})")
    existing_cols = [row[1] for row in cursor.fetchall()]
    if col_name not in existing_cols:
        stmt = f"ALTER TABLE {table} ADD COLUMN {col_name} {col_type}"
        if default_val is not None:
            if isinstance(default_val, str):
                stmt += f" DEFAULT '{default_val}'"
            else:
                stmt += f" DEFAULT {default_val}"
        cursor.execute(stmt)
        return True
    return False

# ----------------------------------------------------------------------------
# PHASE 1: EMPLOYEE + VENDOR METADATA (SECTIONS 1 & 2)
# ----------------------------------------------------------------------------
def run_phase_1():
    print("\n--- RUNNING PHASE 1: EMPLOYEE & VENDOR METADATA MIGRATION ---")
    conn = get_connection()
    cursor = conn.cursor()
    random.seed(42)

    # 1. Employee metadata columns
    emp_cols = [
        ("manager_name", "TEXT", "David Miller"),
        ("team_name", "TEXT", "Core Product"),
        ("office_location", "TEXT", "San Francisco HQ"),
        ("work_mode", "TEXT", "Hybrid"),
        ("timezone", "TEXT", "America/Los_Angeles"),
        ("profile_photo_url", "TEXT", "https://images.unsplash.com/photo-1494790108377-be9c29b29330"),
        ("preferred_language", "TEXT", "English"),
        ("emergency_contact_name", "TEXT", "Alex Smith"),
        ("emergency_contact_relationship", "TEXT", "Spouse"),
        ("emergency_contact_phone", "TEXT", "+1-555-0199"),
        ("target_sleep_hours", "REAL", 8.0),
        ("target_daily_hydration_liters", "REAL", 2.5),
        ("target_weekly_exercise_minutes", "INTEGER", 150),
        ("wellness_goal", "TEXT", "Stress Management & Sleep Optimization"),
        ("communication_preference", "TEXT", "Email"),
        ("login_count", "INTEGER", 14),
        ("account_status", "TEXT", "Active"),
        ("onboarding_completed", "INTEGER", 1)
    ]

    for name, ctype, default in emp_cols:
        add_column_if_not_exists(cursor, "employees", name, ctype, default)

    # Populate unique employee metadata
    cursor.execute("SELECT employee_id, full_name, department FROM employees")
    emps = cursor.fetchall()

    managers = ["David Miller (VP Eng)", "Sarah Connors (Director People)", "Michael Chang (VP Product)"]
    teams = {
        "Engineering": "Core Platform & Infrastructure",
        "QA": "Quality Assurance & Automation",
        "Product": "Product Management & Strategy",
        "Design": "User Experience & Visual Design",
        "Sales": "Enterprise Business Development",
        "HR": "People Operations & Culture",
        "Finance": "Corporate Finance & Analytics",
        "Operations": "Global Business Operations"
    }
    modes = ["Hybrid", "Remote", "Office", "Hybrid", "Hybrid"]
    goals = [
        "Improve Sleep Quality & Rest",
        "Maintain Daily Hydration Target",
        "Reduce Stress & Anxiety",
        "Increase Weekly Physical Activity",
        "Restore Healthy Work-Life Balance"
    ]

    for emp_id, name, dept in emps:
        manager = random.choice(managers)
        team = teams.get(dept, "Corporate Operations")
        mode = random.choice(modes)
        goal = random.choice(goals)
        logins = random.randint(5, 45)

        cursor.execute("""
            UPDATE employees SET
                manager_name = ?,
                team_name = ?,
                work_mode = ?,
                wellness_goal = ?,
                login_count = ?
            WHERE employee_id = ?
        """, (manager, team, mode, goal, logins, emp_id))

    # 2. Vendor metadata columns
    v_cols = [
        ("phone", "TEXT", "+1-800-555-0100"),
        ("website", "TEXT", "https://xyzwellness.com"),
        ("address", "TEXT", "100 Innovation Way, Suite 400"),
        ("pricing_tier", "TEXT", "$$"),
        ("average_rating", "REAL", 4.8),
        ("review_count", "INTEGER", 128),
        ("years_in_business", "INTEGER", 6),
        ("specialties", "TEXT", "Stress Relief, Weight Management, Circadian Rest"),
        ("supported_languages", "TEXT", "English, Spanish"),
        ("cancellation_policy", "TEXT", "Free cancellation up to 24 hours in advance"),
        ("session_duration", "INTEGER", 60),
        ("booking_lead_time", "TEXT", "24 hours advance notice"),
        ("accepts_online_booking", "INTEGER", 1),
        ("accessibility_features", "TEXT", "Wheelchair Accessible, Service Animal Friendly")
    ]

    for name, ctype, default in v_cols:
        add_column_if_not_exists(cursor, "vendors", name, ctype, default)

    conn.commit()
    conn.close()
    print("[SUCCESS] Phase 1 Migration Applied Cleanly.")

# ----------------------------------------------------------------------------
# PHASE 2: APPOINTMENT + EVENT METADATA (SECTIONS 3 & 4)
# ----------------------------------------------------------------------------
def run_phase_2():
    print("\n--- RUNNING PHASE 2: APPOINTMENT & EVENT METADATA MIGRATION ---")
    conn = get_connection()
    cursor = conn.cursor()
    random.seed(42)

    # 3. Appointment metadata columns
    appt_cols = [
        ("booking_date", "TEXT", "2026-07-10"),
        ("confirmation_number", "TEXT", "CNF-88219"),
        ("duration_minutes", "INTEGER", 45),
        ("reminder_sent", "INTEGER", 1),
        ("check_in_time", "TEXT", None),
        ("completion_time", "TEXT", None),
        ("cancellation_reason", "TEXT", None),
        ("attendance_confirmed", "INTEGER", 1),
        ("notes", "TEXT", "Standard corporate wellness intake completed"),
        ("follow_up_required", "INTEGER", 0),
        ("follow_up_date", "TEXT", None),
        ("satisfaction_rating", "INTEGER", 5),
        ("feedback_comment", "TEXT", "Exceptional practitioner, felt immediately relaxed and refreshed."),
        ("would_recommend", "INTEGER", 1)
    ]

    for name, ctype, default in appt_cols:
        add_column_if_not_exists(cursor, "appointments", name, ctype, default)

    # Populate appointment metadata based on status
    cursor.execute("SELECT appointment_id, appointment_date, status FROM appointments")
    appts = cursor.fetchall()

    for appt_id, appt_dt, status in appts:
        cnf_num = f"CNF-{random.randint(10000, 99999)}"
        dt_obj = datetime.strptime(appt_dt, "%Y-%m-%d %H:%M:%S")
        bk_date = (dt_obj - timedelta(days=random.randint(2, 7))).strftime("%Y-%m-%d")

        if status == "Completed":
            check_in = appt_dt
            completion = (dt_obj + timedelta(minutes=45)).strftime("%Y-%m-%d %H:%M:%S")
            rating = random.choice([4, 5, 5, 5])
            cursor.execute("""
                UPDATE appointments SET
                    booking_date = ?,
                    confirmation_number = ?,
                    check_in_time = ?,
                    completion_time = ?,
                    satisfaction_rating = ?,
                    attendance_confirmed = 1
                WHERE appointment_id = ?
            """, (bk_date, cnf_num, check_in, completion, rating, appt_id))

        elif status in ("Cancelled", "No Show"):
            reason = "Schedule conflict due to urgent client call" if status == "Cancelled" else "Overran prior meeting"
            cursor.execute("""
                UPDATE appointments SET
                    booking_date = ?,
                    confirmation_number = ?,
                    cancellation_reason = ?,
                    attendance_confirmed = 0,
                    satisfaction_rating = NULL
                WHERE appointment_id = ?
            """, (bk_date, cnf_num, reason, appt_id))

        else: # Booked / Upcoming
            cursor.execute("""
                UPDATE appointments SET
                    booking_date = ?,
                    confirmation_number = ?,
                    attendance_confirmed = 0
                WHERE appointment_id = ?
            """, (bk_date, cnf_num, appt_id))

    # 4. Event metadata columns
    evt_cols = [
        ("event_description", "TEXT", "Comprehensive corporate wellness workshop designed to optimize physical and mental performance."),
        ("organizer_name", "TEXT", "XYZ People & Culture Team"),
        ("event_banner", "TEXT", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"),
        ("maximum_capacity", "INTEGER", 50),
        ("registered_count", "INTEGER", 28),
        ("seats_remaining", "INTEGER", 22),
        ("registration_deadline", "TEXT", "2026-07-29 23:59:59"),
        ("target_departments", "TEXT", "All Departments"),
        ("difficulty_level", "TEXT", "All Levels"),
        ("event_tags", "TEXT", "Wellness, Mindfulness, Leadership, Stress-Relief"),
        ("estimated_duration", "INTEGER", 60),
        ("event_format", "TEXT", "Hybrid"),
        ("attendance_certificate", "INTEGER", 1)
    ]

    for name, ctype, default in evt_cols:
        add_column_if_not_exists(cursor, "events", name, ctype, default)

    conn.commit()
    conn.close()
    print("[SUCCESS] Phase 2 Migration Applied Cleanly.")

# ----------------------------------------------------------------------------
# PHASE 3: WELLNESS + SERVICE USAGE METADATA (SECTIONS 5 & 6)
# ----------------------------------------------------------------------------
def run_phase_3():
    print("\n--- RUNNING PHASE 3: WELLNESS & SERVICE USAGE METADATA MIGRATION ---")
    conn = get_connection()
    cursor = conn.cursor()
    random.seed(42)

    # 5. Wellness log metadata columns
    well_cols = [
        ("stress_level", "INTEGER", 2),
        ("energy_level", "INTEGER", 4),
        ("exercise_minutes", "INTEGER", 30),
        ("step_count", "INTEGER", 8500),
        ("caffeine_intake", "INTEGER", 1),
        ("water_goal_met", "INTEGER", 1),
        ("sleep_goal_met", "INTEGER", 1),
        ("mood_notes", "TEXT", "Balanced day with steady energy"),
        ("weather", "TEXT", "Clear & Sunny"),
        ("work_intensity", "TEXT", "Moderate")
    ]

    for name, ctype, default in well_cols:
        add_column_if_not_exists(cursor, "employee_wellness_logs", name, ctype, default)

    # Correlate stress and energy with sleep and mood
    cursor.execute("SELECT log_id, sleep_hours, mood_score, hydration_glasses FROM employee_wellness_logs")
    logs = cursor.fetchall()

    for log_id, sleep, mood, hyd in logs:
        if sleep < 6.0:
            stress = random.choice([4, 5])
            energy = random.choice([1, 2])
            sleep_met = 0
            intensity = "High"
        elif sleep >= 7.5:
            stress = random.choice([1, 2])
            energy = random.choice([4, 5])
            sleep_met = 1
            intensity = "Moderate"
        else:
            stress = 3
            energy = 3
            sleep_met = 1
            intensity = "Moderate"

        water_met = 1 if hyd >= 8.0 else 0
        steps = random.randint(6000, 12000) if energy >= 3 else random.randint(3000, 6000)

        cursor.execute("""
            UPDATE employee_wellness_logs SET
                stress_level = ?,
                energy_level = ?,
                step_count = ?,
                sleep_goal_met = ?,
                water_goal_met = ?,
                work_intensity = ?
            WHERE log_id = ?
        """, (stress, energy, steps, sleep_met, water_met, intensity, log_id))

    # 6. Service usage metadata columns
    usage_cols = [
        ("first_visit", "TEXT", "2026-05-10"),
        ("last_visit", "TEXT", "2026-07-15"),
        ("average_visit_interval", "INTEGER", 14),
        ("favorite_vendor", "TEXT", "Serene Touch Wellness"),
        ("completion_rate", "REAL", 100.0),
        ("missed_sessions", "INTEGER", 0),
        ("cancelled_sessions", "INTEGER", 0),
        ("upcoming_sessions", "INTEGER", 1)
    ]

    for name, ctype, default in usage_cols:
        add_column_if_not_exists(cursor, "service_usage", name, ctype, default)

    conn.commit()
    conn.close()
    print("[SUCCESS] Phase 3 Migration Applied Cleanly.")

# ----------------------------------------------------------------------------
# REGRESSION VERIFICATION RUNNER
# ----------------------------------------------------------------------------
def verify_regressions():
    print("\n=== EXECUTING REGRESSION VERIFICATION SUITE ===")
    conn = get_connection()
    cursor = conn.cursor()

    # Check E023 Priya Ramesh
    cursor.execute("SELECT sleep_hours, hydration_glasses FROM employee_wellness_logs WHERE employee_id = 'E023' ORDER BY log_date DESC LIMIT 14")
    priya_logs = cursor.fetchall()
    avg_sleep = round(sum(l[0] for l in priya_logs) / len(priya_logs), 1)
    avg_hyd = round(sum(l[1] for l in priya_logs) / len(priya_logs), 1)

    assert avg_sleep == 5.6, f"Priya Ramesh avg_sleep expected 5.6, got {avg_sleep}"
    assert avg_hyd == 4.2, f"Priya Ramesh avg_hyd expected 4.2, got {avg_hyd}"
    print("[VERIFIED] E023 Priya Ramesh physiological baseline remains 5.6 hrs sleep & 4.2 glasses hydration.")

    # Check EMP-014 Sarah Jenkins
    cursor.execute("SELECT sleep_hours, hydration_glasses FROM employee_wellness_logs WHERE employee_id = 'EMP-014' ORDER BY log_date DESC LIMIT 14")
    sarah_logs = cursor.fetchall()
    sarah_sleep = round(sum(l[0] for l in sarah_logs) / len(sarah_logs), 1)
    sarah_hyd = round(sum(l[1] for l in sarah_logs) / len(sarah_logs), 1)

    assert sarah_sleep == 5.8, f"Sarah Jenkins avg_sleep expected 5.8, got {sarah_sleep}"
    assert sarah_hyd == 8.0, f"Sarah Jenkins avg_hyd expected 8.0, got {sarah_hyd}"
    print("[VERIFIED] EMP-014 Sarah Jenkins physiological baseline remains 5.8 hrs sleep & 8.0 glasses hydration.")
    conn.close()

if __name__ == "__main__":
    run_phase_1()
    verify_regressions()

    run_phase_2()
    verify_regressions()

    run_phase_3()
    verify_regressions()

    print("\n>>> ALL PHASES (1, 2, 3) COMPLETED & VERIFIED 100% REGRESSION CLEAN! <<<")
