import os
import sqlite3
import bcrypt
from datetime import datetime
from generate_postgres_seed import (
    generate_employees,
    generate_vendors,
    generate_wellness_logs,
    generate_appointments,
    generate_service_usage,
    generate_events,
    generate_event_registrations,
    validate_recommendations
)

DB_PATH = os.path.join(os.path.dirname(__file__), "wellness.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")

def init_and_seed_db():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    cursor = conn.cursor()

    # Read and execute schema
    with open(SCHEMA_PATH, "r") as f:
        schema_sql = f.read()
    cursor.executescript(schema_sql)

    # 1. Employees
    employees = generate_employees()
    priya_hash = bcrypt.hashpw("Password123!".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    emp_tuples = []
    for e in employees:
        pwd_h = priya_hash if e["employee_id"] == "E023" else None
        pwd_c = 1 if e["employee_id"] == "E023" else 0
        emp_tuples.append((
            e["employee_id"], e["full_name"], e["email"], e["department"], e["job_title"],
            pwd_h, 1, pwd_c, '2026-07-26 10:00:00' if e["employee_id"] == "E023" else None, None, None
        ))

    cursor.executemany(
        """INSERT INTO employees 
        (employee_id, full_name, email, department, role, password_hash, is_active, password_created, last_login, reset_token, reset_token_expiry) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        emp_tuples
    )

    # 2. Vendors
    vendors = generate_vendors()
    vendor_tuples = [(v["vendor_id"], v["vendor_name"], v["service_category"], v["contact_email"], v["city"]) for v in vendors]
    cursor.executemany("INSERT INTO vendors (vendor_id, name, category, contact_email, location) VALUES (?, ?, ?, ?, ?)", vendor_tuples)

    # 3. Services (Standard 12 wellness services)
    services = [
        (1, 1, 'Deep Tissue Recovery Massage', 'massage', 'Therapeutic deep tissue massage for stress relief', 60),
        (2, 2, 'Personalized Nutrition Consult', 'nutrition', '1-on-1 diet and hydration strategy session', 45),
        (3, 3, 'Organic Farm-to-Table Lunch Pass', 'organic_food', 'Daily fresh organic meal voucher', None),
        (4, 4, 'Hydrotherapy & Thermal Springs Access', 'thermal_spa', 'Full day pass to thermal mineral springs', 90),
        (5, 5, 'Infrared Cedar Sauna Session', 'sauna', 'Detoxifying infrared sauna session', 45),
        (6, 6, 'Ayurvedic Dosha Evaluation', 'ayurvedic_doctor', 'Traditional Ayurvedic health assessment', 60),
        (7, 7, 'Corporate Mindful Leadership Workshop', 'on_premise_events', 'Group workshop on stress management', 120),
        (8, 8, 'Restorative Yin Yoga & Breathwork', 'yoga', 'Guided yoga and deep breathwork class', 60),
        (9, 9, 'Sleep Coaching Consultation', 'diet_planning', 'Targeted sleep hygiene and circadian rhythm optimization', 30),
        (10, 8, 'Sunrise Vinyasa Flow', 'yoga', 'Energizing morning yoga class', 45),
        (11, 2, 'Metabolic Diet Planning', 'diet_planning', 'Custom metabolic food roadmap', 45),
        (12, 7, 'On-Site Ergonomics & Posture Clinic', 'on_premise_events', 'Workplace ergonomics evaluation', 90)
    ]
    cursor.executemany("INSERT INTO services (service_id, vendor_id, title, category, description, duration_minutes) VALUES (?, ?, ?, ?, ?, ?)", services)

    # 4. Daily Wellness Logs (2,500 records)
    logs = generate_wellness_logs(employees)
    log_tuples = [
        (l["employee_id"], l["log_date"], l["sleep_hours"], l["hydration_amount"], l["hydration_oz"], l["healthy_food_logged"], l["mood_score"], 450, 60)
        for l in logs
    ]
    cursor.executemany(
        """INSERT INTO employee_wellness_logs 
        (employee_id, log_date, sleep_hours, hydration_glasses, hydration_oz, healthy_food_logged, mood_score, active_energy_kcal, hrv_ms) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        log_tuples
    )

    # 5. Appointments
    appts = generate_appointments(employees, vendors)
    appt_tuples = [
        (a["appointment_id"], a["employee_id"], a["service_id"], a["appointment_date"], a["location"], a["status"])
        for a in appts
    ]
    cursor.executemany("INSERT INTO appointments (appointment_id, employee_id, service_id, appointment_date, location, status) VALUES (?, ?, ?, ?, ?, ?)", appt_tuples)

    # 6. Service Usage Summary
    usage = generate_service_usage(appts, employees)
    usage_tuples = [
        (u["usage_id"], u["employee_id"], u["service_category"], u["usage_date"], u["completed_sessions"])
        for u in usage
    ]
    cursor.executemany("INSERT INTO service_usage (usage_id, employee_id, service_category, usage_date, count) VALUES (?, ?, ?, ?, ?)", usage_tuples)

    # 7. Events & Registrations
    events = generate_events(vendors)
    evt_tuples = [(ev["event_id"], 1, ev["title"], ev["event_date"], ev["location"]) for ev in events]
    cursor.executemany("INSERT INTO events (event_id, service_id, event_title, event_date, location) VALUES (?, ?, ?, ?, ?)", evt_tuples)

    regs = generate_event_registrations(events, employees)
    reg_tuples = [(r["registration_id"], r["employee_id"], r["event_id"], r["registration_status"], r["pass_code"]) for r in regs]
    cursor.executemany("INSERT INTO event_registrations (registration_id, employee_id, event_id, registration_status, pass_code) VALUES (?, ?, ?, ?, ?)", reg_tuples)

    conn.commit()
    conn.close()

    # Apply Schema & Metadata Migration (Phases 1, 2, 3)
    from migrate_enrichment import run_phase_1, run_phase_2, run_phase_3, verify_regressions
    run_phase_1()
    run_phase_2()
    run_phase_3()
    verify_regressions()

    print(f"Database successfully synced and enriched at {DB_PATH}")

if __name__ == "__main__":
    init_and_seed_db()
