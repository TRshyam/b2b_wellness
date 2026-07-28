"""
XYZ Corporate Wellness Dashboard - Fictional Enterprise Seed Data Generator
Target Database: PostgreSQL / SQLite
Seed: 42 (Deterministic & Fully Reproducible)
"""

import os
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any
from faker import Faker

# Set deterministic random seed
SEED_VAL = 42
random.seed(SEED_VAL)
fake = Faker()
Faker.seed(SEED_VAL)

# ----------------------------------------------------------------------------
# 1. CONSTANTS & DOMAIN SPECIFICATIONS
# ----------------------------------------------------------------------------
ALL_SERVICE_CATEGORIES = [
    "massage", "organic_food", "diet_planning", "nutrition",
    "thermal_spa", "sauna", "ayurvedic_doctor", "on_premise_events", "yoga"
]

DEPARTMENTS = ["Engineering", "QA", "Product", "Design", "Sales", "HR", "Finance", "Operations"]
LOCATIONS = ["San Francisco, CA", "New York, NY", "Austin, TX", "London, UK", "Remote (US)", "Remote (EU)"]
STATUSES = ["Active", "Active", "Active", "Active", "On Leave"]
TIMEZONES = ["America/Los_Angeles", "America/New_York", "Europe/London", "America/Chicago"]

BEHAVIOR_PROFILES = [
    "Consistently Healthy",
    "Declining Sleep",
    "Poor Hydration",
    "High Stress",
    "Inconsistent Routine",
    "Weekend Recovery",
    "Improving Lifestyle",
    "Low Mood",
    "Burnout Recovery"
]

# ----------------------------------------------------------------------------
# 2. GENERATE EMPLOYEES (50 Records)
# ----------------------------------------------------------------------------
def generate_employees() -> List[Dict[str, Any]]:
    employees = []
    managers = ["David Miller (VP Eng)", "Sarah Connors (Director People)", "Michael Chang (VP Product)"]

    # Special Regression Employees (MUST BE EXACT)
    employees.append({
        "employee_id": "E023",
        "full_name": "Priya Ramesh",
        "email": "priya.ramesh@xyz.com",
        "department": "QA",
        "job_title": "Software QA Lead",
        "join_date": "2022-04-15",
        "work_location": "San Francisco, CA",
        "employment_status": "Active",
        "manager_name": "Michael Chang (VP Product)",
        "timezone": "America/Los_Angeles",
        "behavior_profile": "Declining Sleep"
    })

    employees.append({
        "employee_id": "EMP-014",
        "full_name": "Sarah Jenkins",
        "email": "sarah.jenkins@xyz.com",
        "department": "Engineering",
        "job_title": "Senior Frontend Developer",
        "join_date": "2021-09-01",
        "work_location": "Remote (US)",
        "employment_status": "Active",
        "manager_name": "David Miller (VP Eng)",
        "timezone": "America/New_York",
        "behavior_profile": "Declining Sleep"
    })

    profiles_pool = (
        ["Consistently Healthy"] * 14 +
        ["Declining Sleep"] * 12 +
        ["Poor Hydration"] * 10 +
        ["High Stress"] * 7 +
        ["Burnout Recovery"] * 5
    )
    random.shuffle(profiles_pool)

    for i in range(1, 51):
        emp_id = f"EMP-{i:03d}"
        if emp_id in ("EMP-014", "EMP-023"):
            continue
        
        gender_male = random.choice([True, False])
        fname = fake.first_name_male() if gender_male else fake.first_name_female()
        lname = fake.last_name()
        dept = random.choice(DEPARTMENTS)
        
        job_titles = {
            "Engineering": ["Staff Software Engineer", "Backend Engineer", "DevOps Specialist", "Frontend Developer"],
            "QA": ["QA Automation Engineer", "Test Engineer"],
            "Product": ["Senior Product Manager", "Product Analyst"],
            "Design": ["Lead Product Designer", "UX Researcher"],
            "Sales": ["Enterprise Account Executive", "Sales Operations Manager"],
            "HR": ["People Operations Partner", "Talent Acquisition Specialist"],
            "Finance": ["Senior Financial Analyst", "Accounting Manager"],
            "Operations": ["Operations Associate", "Logistics Lead"]
        }
        title = random.choice(job_titles[dept])
        
        years_ago = random.randint(1, 5)
        join_dt = (datetime.now() - timedelta(days=years_ago * 365 + random.randint(0, 300))).strftime("%Y-%m-%d")
        profile = profiles_pool.pop() if profiles_pool else random.choice(BEHAVIOR_PROFILES)

        employees.append({
            "employee_id": emp_id,
            "full_name": f"{fname} {lname}",
            "email": f"{fname.lower()}.{lname.lower()}{i}@xyz.com",
            "department": dept,
            "job_title": title,
            "join_date": join_dt,
            "work_location": random.choice(LOCATIONS),
            "employment_status": random.choice(STATUSES),
            "manager_name": random.choice(managers),
            "timezone": random.choice(TIMEZONES),
            "behavior_profile": profile
        })

    return employees

# ----------------------------------------------------------------------------
# 3. GENERATE VENDORS (18-20 Records)
# ----------------------------------------------------------------------------
def generate_vendors() -> List[Dict[str, Any]]:
    vendors = [
        (1, "Serene Touch Wellness", "massage", "contact@serenetouch.com", "+1-800-555-0101", "https://serenetouch.com", "Both", "San Francisco, CA"),
        (2, "NutriBalance Co.", "nutrition", "hello@nutribalance.io", "+1-800-555-0102", "https://nutribalance.io", "Online", "New York, NY"),
        (3, "GreenBite Organic Catering", "organic_food", "orders@greenbite.com", "+1-800-555-0103", "https://greenbite.com", "On-premise", "San Francisco, CA"),
        (4, "Solace Thermal Spa", "thermal_spa", "reservations@solacespa.com", "+1-800-555-0104", "https://solacespa.com", "On-premise", "Austin, TX"),
        (5, "Nordic Sanctuary Sauna", "sauna", "book@nordicsanctuary.com", "+1-800-555-0105", "https://nordicsanctuary.com", "On-premise", "London, UK"),
        (6, "Ayurveda Health Center", "ayurvedic_doctor", "info@ayurvedahealth.org", "+1-800-555-0106", "https://ayurvedahealth.org", "Both", "San Francisco, CA"),
        (7, "Human Potential Institute", "on_premise_events", "events@humanpotential.org", "+1-800-555-0107", "https://humanpotential.org", "Both", "New York, NY"),
        (8, "Zenith Yoga & Mindfulness", "yoga", "namaste@zenithyoga.com", "+1-800-555-0108", "https://zenithyoga.com", "Both", "Austin, TX"),
        (9, "Sleep & Recovery Labs", "diet_planning", "care@sleeplabs.com", "+1-800-555-0109", "https://sleeplabs.com", "Online", "San Francisco, CA"),
        (10, "Apex Physical Recovery", "massage", "support@apexrecovery.com", "+1-800-555-0110", "https://apexrecovery.com", "On-premise", "San Francisco, CA"),
        (11, "Harvest Table Organics", "organic_food", "catering@harvesttable.com", "+1-800-555-0111", "https://harvesttable.com", "On-premise", "New York, NY"),
        (12, "Metabolic Precision Labs", "diet_planning", "info@metabolicprecision.io", "+1-800-555-0112", "https://metabolicprecision.io", "Online", "Austin, TX"),
        (13, "BioGut Microbiome Clinic", "nutrition", "care@biogut.com", "+1-800-555-0113", "https://biogut.com", "Online", "San Francisco, CA"),
        (14, "Epsom Springs Mineral Spa", "thermal_spa", "contact@epsomsprings.com", "+1-800-555-0114", "https://epsomsprings.com", "On-premise", "London, UK"),
        (15, "Infrared Health Sauna Co.", "sauna", "hello@infraredsauna.com", "+1-800-555-0115", "https://infraredsauna.com", "On-premise", "San Francisco, CA"),
        (16, "Panchakarma Ayurvedic Doctor", "ayurvedic_doctor", "dr@panchakarma.org", "+1-800-555-0116", "https://panchakarma.org", "Both", "New York, NY"),
        (17, "BioAlign Posture & Ergonomics", "on_premise_events", "clinic@bioalign.com", "+1-800-555-0117", "https://bioalign.com", "On-premise", "Austin, TX"),
        (18, "Vinyasa Flow Studio", "yoga", "flow@vinyasastudio.com", "+1-800-555-0118", "https://vinyasastudio.com", "Both", "San Francisco, CA")
    ]

    res = []
    for v in vendors:
        res.append({
            "vendor_id": v[0],
            "vendor_name": v[1],
            "service_category": v[2],
            "contact_email": v[3],
            "phone": v[4],
            "website": v[5],
            "supported_formats": v[6],
            "city": v[7]
        })
    return res

# ----------------------------------------------------------------------------
# 4. GENERATE DAILY WELLNESS LOGS (50 Days x 50 Employees = 2,500 Records)
# ----------------------------------------------------------------------------
def generate_wellness_logs(employees: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    logs = []
    base_date = datetime(2026, 7, 24)

    sleep_e023 = [6.8, 6.4, 6.2, 6.0, 5.8, 5.6, 5.4, 5.2, 5.0, 4.8, 4.6, 4.8, 5.0, 6.8]
    hyd_e023 = [4.5, 4.0, 4.2, 4.5, 4.0, 4.2, 4.5, 4.0, 4.2, 4.0, 4.2, 4.5, 4.0, 4.0]
    food_e023 = [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0]
    mood_e023 = [4.0, 3.8, 3.7, 3.9, 3.8, 3.6, 3.5, 3.2, 3.0, 2.8, 2.9, 3.1, 3.2, 3.0]

    sleep_emp014 = [6.2, 6.0, 5.9, 5.8, 5.7, 5.6, 5.8, 5.7, 5.8, 5.9, 5.7, 5.8, 5.9, 6.0]
    hyd_emp014 = [8.0] * 14
    food_emp014 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]
    mood_emp014 = [3.2, 3.1, 3.1, 3.1, 3.0, 3.1, 3.1, 3.1, 3.1, 3.1, 3.0, 3.1, 3.2, 3.1]

    for emp in employees:
        emp_id = emp["employee_id"]
        profile = emp.get("behavior_profile", "Consistently Healthy")

        for day in range(50):
            log_dt = (base_date - timedelta(days=49 - day)).strftime("%Y-%m-%d")
            is_weekend = (base_date - timedelta(days=49 - day)).weekday() >= 5

            if emp_id == "E023" and day >= 36:
                idx = day - 36
                sleep = sleep_e023[idx]
                hyd = hyd_e023[idx]
                food = food_e023[idx]
                mood = mood_e023[idx]
            elif emp_id == "EMP-014" and day >= 36:
                idx = day - 36
                sleep = sleep_emp014[idx]
                hyd = hyd_emp014[idx]
                food = food_emp014[idx]
                mood = mood_emp014[idx]
            else:
                if profile == "Consistently Healthy":
                    sleep = round(random.uniform(7.4, 8.4) + (0.5 if is_weekend else 0.0), 1)
                    hyd = round(random.uniform(7.5, 9.0), 1)
                    mood = round(random.uniform(4.0, 5.0), 1)
                    food = 1 if random.random() > 0.15 else 0
                elif profile == "Declining Sleep":
                    sleep = round(max(4.5, 6.8 - (day * 0.03)) + random.uniform(-0.3, 0.3), 1)
                    hyd = round(random.uniform(6.5, 8.0), 1)
                    mood = round(random.uniform(3.2, 4.0), 1)
                    food = 1 if random.random() > 0.3 else 0
                elif profile == "Poor Hydration":
                    sleep = round(random.uniform(7.0, 8.0), 1)
                    hyd = round(random.uniform(3.5, 4.8), 1)
                    mood = round(random.uniform(3.5, 4.2), 1)
                    food = 1 if random.random() > 0.4 else 0
                elif profile == "High Stress":
                    sleep = round(random.uniform(6.5, 7.5), 1)
                    hyd = round(random.uniform(6.0, 7.5), 1)
                    mood = round(4.2 - (0.04 * day if day > 25 else 0) + random.uniform(-0.2, 0.2), 1)
                    food = 1 if random.random() > 0.4 else 0
                else:
                    sleep = round(random.uniform(5.2, 6.2), 1)
                    hyd = round(random.uniform(4.0, 6.0), 1)
                    mood = round(random.uniform(3.0, 3.8), 1)
                    food = 1 if random.random() > 0.5 else 0

            logs.append({
                "employee_id": emp_id,
                "log_date": log_dt,
                "sleep_hours": sleep,
                "hydration_amount": hyd,
                "hydration_oz": round(hyd * 8.0, 1),
                "mood_score": mood,
                "food_quality": "Healthy" if food == 1 else "Standard",
                "healthy_food_logged": food,
                "notes": f"Logged via XYZ Aura App ({profile})"
            })

    return logs

# ----------------------------------------------------------------------------
# 5. GENERATE APPOINTMENTS (2-4 per Employee)
# ----------------------------------------------------------------------------
def generate_appointments(employees: List[Dict[str, Any]], vendors: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    appts = []

    vendor_by_cat = {}
    for v in vendors:
        cat = v["service_category"]
        if cat not in vendor_by_cat:
            vendor_by_cat[cat] = []
        vendor_by_cat[cat].append(v)

    appts.append({
        "appointment_id": 1,
        "employee_id": "E023",
        "service_id": 1,
        "vendor_id": 1,
        "service_category": "massage",
        "service_title": "Deep Tissue Recovery Massage",
        "appointment_date": "2026-07-28 17:30:00",
        "location": "On-premise, Room 2",
        "status": "Booked",
        "format": "On-premise"
    })
    appts.append({
        "appointment_id": 2,
        "employee_id": "E023",
        "service_id": 2,
        "vendor_id": 2,
        "service_category": "nutrition",
        "service_title": "Personalized Nutrition Consult",
        "appointment_date": "2026-08-03 11:00:00",
        "location": "Online",
        "status": "Booked",
        "format": "Online"
    })

    appts.append({
        "appointment_id": 3,
        "employee_id": "EMP-014",
        "service_id": 10,
        "vendor_id": 8,
        "service_category": "yoga",
        "service_title": "Sunrise Vinyasa Flow",
        "appointment_date": "2026-07-29 09:00:00",
        "location": "Rooftop Pavilion",
        "status": "Booked",
        "format": "On-premise"
    })
    appt_id_counter = 4

    statuses = ["Completed", "Completed", "Completed", "Upcoming", "Cancelled", "No Show"]
    
    for emp in employees:
        emp_id = emp["employee_id"]
        if emp_id in ("E023", "EMP-014"):
            continue

        num_appts = random.randint(2, 4)
        for _ in range(num_appts):
            cat = random.choice(ALL_SERVICE_CATEGORIES)
            v = random.choice(vendor_by_cat.get(cat, vendors))
            st = random.choice(statuses)
            
            if st == "Completed":
                dt = (datetime(2026, 7, 24) - timedelta(days=random.randint(2, 60))).strftime("%Y-%m-%d %H:%M:%S")
            else:
                dt = (datetime(2026, 7, 24) + timedelta(days=random.randint(1, 14))).strftime("%Y-%m-%d %H:%M:%S")

            appts.append({
                "appointment_id": appt_id_counter,
                "employee_id": emp_id,
                "service_id": (v["vendor_id"] % 12) + 1,
                "vendor_id": v["vendor_id"],
                "service_category": cat,
                "service_title": f"{v['vendor_name']} Session",
                "appointment_date": dt,
                "location": v["city"] if v["supported_formats"] == "On-premise" else "Online",
                "status": "Booked" if st == "Upcoming" else st,
                "format": "Online" if "Online" in v["supported_formats"] else "On-premise"
            })
            appt_id_counter += 1

    return appts

# ----------------------------------------------------------------------------
# 6. GENERATE SERVICE USAGE SUMMARY
# ----------------------------------------------------------------------------
def generate_service_usage(appts: List[Dict[str, Any]], employees: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    usage_list = []
    usage_id_counter = 1

    counts = {}
    for a in appts:
        if a["status"] in ("Completed", "Booked", "CONFIRMED"):
            emp_id = a["employee_id"]
            cat = a["service_category"]
            counts[(emp_id, cat)] = counts.get((emp_id, cat), 0) + 1

    counts[("EMP-014", "yoga")] = 12
    counts[("EMP-014", "on_premise_events")] = 2
    counts[("EMP-014", "diet_planning")] = 1
    counts[("EMP-014", "sauna")] = 3

    counts[("E023", "yoga")] = 3
    counts[("E023", "organic_food")] = 15
    counts[("E023", "diet_planning")] = 1
    counts[("E023", "thermal_spa")] = 0
    counts[("E023", "sauna")] = 0

    for (emp_id, cat), count_val in counts.items():
        if count_val > 0:
            usage_list.append({
                "usage_id": usage_id_counter,
                "employee_id": emp_id,
                "service_category": cat,
                "completed_sessions": count_val,
                "usage_date": "2026-07-15"
            })
            usage_id_counter += 1

    return usage_list

# ----------------------------------------------------------------------------
# 7. GENERATE EVENTS & REGISTRATIONS
# ----------------------------------------------------------------------------
def generate_events(vendors: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [
        {
            "event_id": 1,
            "title": "Restorative Yin Yoga & Breathwork",
            "vendor_name": "Zenith Yoga & Mindfulness",
            "category": "yoga",
            "location": "Main Auditorium",
            "event_date": "2026-07-30 17:00:00",
            "status": "Upcoming"
        },
        {
            "event_id": 2,
            "title": "Corporate Mindful Leadership Workshop",
            "vendor_name": "Human Potential Institute",
            "category": "on_premise_events",
            "location": "Main Auditorium",
            "event_date": "2026-07-15 14:00:00",
            "status": "Completed"
        },
        {
            "event_id": 3,
            "title": "Sunrise Vinyasa Flow",
            "vendor_name": "Zenith Yoga & Mindfulness",
            "category": "yoga",
            "location": "Rooftop Pavilion",
            "event_date": "2026-08-05 08:00:00",
            "status": "Upcoming"
        },
        {
            "event_id": 4,
            "title": "On-Site Ergonomics & Posture Clinic",
            "vendor_name": "BioAlign Posture & Ergonomics",
            "category": "on_premise_events",
            "location": "Wellness Suite 3",
            "event_date": "2026-07-10 11:00:00",
            "status": "Completed"
        },
        {
            "event_id": 5,
            "title": "Gut Health & Microbiome Analysis Seminar",
            "vendor_name": "BioGut Microbiome Clinic",
            "category": "nutrition",
            "location": "Virtual Suite A",
            "event_date": "2026-08-12 16:00:00",
            "status": "Upcoming"
        }
    ]

def generate_event_registrations(events: List[Dict[str, Any]], employees: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    regs = [
        {"registration_id": 1, "employee_id": "E023", "event_id": 1, "registration_status": "REGISTERED", "pass_code": "PASS-E023-01"},
        {"registration_id": 2, "employee_id": "E023", "event_id": 2, "registration_status": "ATTENDED", "pass_code": "PASS-E023-02"},
        {"registration_id": 3, "employee_id": "EMP-014", "event_id": 3, "registration_status": "REGISTERED", "pass_code": "PASS-EMP014-01"},
        {"registration_id": 4, "employee_id": "EMP-014", "event_id": 4, "registration_status": "ATTENDED", "pass_code": "PASS-EMP014-02"}
    ]

    reg_id_counter = 5
    for i in range(1, 25):
        emp = random.choice(employees)
        evt = random.choice(events)
        st = "REGISTERED" if evt["status"] == "Upcoming" else random.choice(["ATTENDED", "MISSED"])
        regs.append({
            "registration_id": reg_id_counter,
            "employee_id": emp["employee_id"],
            "event_id": evt["event_id"],
            "registration_status": st,
            "pass_code": f"PASS-{emp['employee_id']}-{reg_id_counter:02d}"
        })
        reg_id_counter += 1

    return regs

# ----------------------------------------------------------------------------
# 8. RECOMMENDATION ENGINE VALIDATION REPORT
# ----------------------------------------------------------------------------
def validate_recommendations(employees: List[Dict[str, Any]], logs: List[Dict[str, Any]], usage: List[Dict[str, Any]], appts: List[Dict[str, Any]]):
    rule_counts = {
        "SLEEP_COACHING": 0,
        "THERMAL_SPA_SAUNA": 0,
        "HYDRATION_CONSULT": 0,
        "MOOD_MINDFULNESS": 0,
        "FITNESS_YOGA": 0
    }

    logs_by_emp = {}
    for l in logs:
        emp_id = l["employee_id"]
        if emp_id not in logs_by_emp:
            logs_by_emp[emp_id] = []
        logs_by_emp[emp_id].append(l)

    usage_by_emp = {}
    for u in usage:
        emp_id = u["employee_id"]
        if emp_id not in usage_by_emp:
            usage_by_emp[emp_id] = {}
        usage_by_emp[emp_id][u["service_category"]] = u["completed_sessions"]

    qa_summary_rows = []

    for emp in employees:
        emp_id = emp["employee_id"]
        emp_logs = logs_by_emp.get(emp_id, [])[-14:]
        
        if not emp_logs:
            continue

        avg_sleep = round(sum(l["sleep_hours"] for l in emp_logs) / len(emp_logs), 1)
        avg_hyd = round(sum(l["hydration_amount"] for l in emp_logs) / len(emp_logs), 1)
        avg_mood = round(sum(l["mood_score"] for l in emp_logs) / len(emp_logs), 1)

        w1_mood = sum(l["mood_score"] for l in emp_logs[:7]) / 7.0
        w2_mood = sum(l["mood_score"] for l in emp_logs[7:]) / 7.0
        mood_declining = (w2_mood - w1_mood) < -0.2

        emp_usage = usage_by_emp.get(emp_id, {})
        spa_sauna = emp_usage.get("thermal_spa", 0) + emp_usage.get("sauna", 0)
        sleep_coaching_appts = sum(1 for a in appts if a["employee_id"] == emp_id and a["service_id"] == 9)

        emp_rules = []
        if avg_sleep < 6.0:
            if spa_sauna == 0:
                rule_counts["THERMAL_SPA_SAUNA"] += 1
                emp_rules.append("THERMAL_SPA_SAUNA")
            elif sleep_coaching_appts == 0:
                rule_counts["SLEEP_COACHING"] += 1
                emp_rules.append("SLEEP_COACHING")
        
        if avg_hyd < 6.0 and len(emp_rules) < 2:
            rule_counts["HYDRATION_CONSULT"] += 1
            emp_rules.append("HYDRATION_CONSULT")

        if mood_declining and len(emp_rules) < 2:
            rule_counts["MOOD_MINDFULNESS"] += 1
            emp_rules.append("MOOD_MINDFULNESS")

        yoga_usage = emp_usage.get("yoga", 0)
        if yoga_usage == 0 and len(emp_rules) < 2:
            rule_counts["FITNESS_YOGA"] += 1
            emp_rules.append("FITNESS_YOGA")

        qa_summary_rows.append({
            "employee_id": emp_id,
            "full_name": emp["full_name"],
            "profile": emp.get("behavior_profile", "Healthy"),
            "triggered_rules": ", ".join(emp_rules) if emp_rules else "None",
            "completed_sessions": sum(emp_usage.values()),
            "avg_sleep": avg_sleep,
            "avg_hyd": avg_hyd,
            "avg_mood": avg_mood
        })

    # Validate Priya Ramesh (E023)
    priya_row = next(r for r in qa_summary_rows if r["employee_id"] == "E023")
    assert priya_row["avg_sleep"] == 5.6, f"Priya sleep expected 5.6, got {priya_row['avg_sleep']}"
    assert priya_row["avg_hyd"] == 4.2, f"Priya hydration expected 4.2, got {priya_row['avg_hyd']}"
    assert "THERMAL_SPA_SAUNA" in priya_row["triggered_rules"] and "HYDRATION_CONSULT" in priya_row["triggered_rules"], "Priya Ramesh spec scenario mismatch!"

    # Validate Sarah Jenkins (EMP-014)
    sarah_row = next(r for r in qa_summary_rows if r["employee_id"] == "EMP-014")
    assert sarah_row["avg_sleep"] == 5.8, f"Sarah sleep expected 5.8, got {sarah_row['avg_sleep']}"
    assert "SLEEP_COACHING" in sarah_row["triggered_rules"], "Sarah Jenkins spec scenario mismatch!"

    for rule, count in rule_counts.items():
        assert count >= 5, f"Rule {rule} triggered by {count} employees (expected >= 5)"

    return rule_counts, qa_summary_rows

# ----------------------------------------------------------------------------
# 9. MAIN FUNCTION & POSTGRES SCRIPT EXPORT
# ----------------------------------------------------------------------------
def main():
    print("=" * 80)
    print("XYZ CORPORATE WELLNESS DASHBOARD - SEED DATA GENERATOR (SEED = 42)")
    print("=" * 80)

    employees = generate_employees()
    vendors = generate_vendors()
    logs = generate_wellness_logs(employees)
    appts = generate_appointments(employees, vendors)
    usage = generate_service_usage(appts, employees)
    events = generate_events(vendors)
    registrations = generate_event_registrations(events, employees)

    rule_counts, qa_summary = validate_recommendations(employees, logs, usage, appts)

    def clean_str(val):
        return str(val).replace("'", "''")

    sql_path = os.path.join(os.path.dirname(__file__), "seed_postgres.sql")
    with open(sql_path, "w", encoding="utf-8") as f:
        f.write("-- PostgreSQL Seed Script for XYZ Corporate Wellness Dashboard\n")
        f.write("-- Generated Deterministically with Seed = 42\n\n")
        f.write("BEGIN;\n\n")

        f.write("-- 1. EMPLOYEES\n")
        for e in employees:
            f.write(f"INSERT INTO employees (employee_id, full_name, email, department, role, is_active, password_created) VALUES ('{e['employee_id']}', '{clean_str(e['full_name'])}', '{e['email']}', '{e['department']}', '{clean_str(e['job_title'])}', 1, 0) ON CONFLICT (employee_id) DO NOTHING;\n")

        f.write("\n-- 2. VENDORS\n")
        for v in vendors:
            f.write(f"INSERT INTO vendors (vendor_id, name, category, contact_email, location) VALUES ({v['vendor_id']}, '{clean_str(v['vendor_name'])}', '{v['service_category']}', '{v['contact_email']}', '{clean_str(v['city'])}') ON CONFLICT DO NOTHING;\n")

        f.write("\n-- 3. WELLNESS LOGS (2500 Records)\n")
        for l in logs:
            f.write(f"INSERT INTO employee_wellness_logs (employee_id, log_date, sleep_hours, hydration_glasses, hydration_oz, healthy_food_logged, mood_score) VALUES ('{l['employee_id']}', '{l['log_date']}', {l['sleep_hours']}, {l['hydration_amount']}, {l['hydration_oz']}, {l['healthy_food_logged']}, {l['mood_score']});\n")

        f.write("\n-- 4. APPOINTMENTS\n")
        for a in appts:
            f.write(f"INSERT INTO appointments (appointment_id, employee_id, service_id, appointment_date, location, status) VALUES ({a['appointment_id']}, '{a['employee_id']}', {a['service_id']}, '{a['appointment_date']}', '{clean_str(a['location'])}', '{a['status']}');\n")

        f.write("\n-- 5. SERVICE USAGE\n")
        for u in usage:
            f.write(f"INSERT INTO service_usage (usage_id, employee_id, service_category, usage_date, count) VALUES ({u['usage_id']}, '{u['employee_id']}', '{u['service_category']}', '{u['usage_date']}', {u['completed_sessions']});\n")

        f.write("\n-- 6. EVENTS\n")
        for ev in events:
            f.write(f"INSERT INTO events (event_id, service_id, event_title, event_date, location) VALUES ({ev['event_id']}, 1, '{clean_str(ev['title'])}', '{ev['event_date']}', '{clean_str(ev['location'])}');\n")

        f.write("\n-- 7. EVENT REGISTRATIONS\n")
        for r in registrations:
            f.write(f"INSERT INTO event_registrations (registration_id, employee_id, event_id, registration_status, pass_code) VALUES ({r['registration_id']}, '{r['employee_id']}', {r['event_id']}, '{r['registration_status']}', '{r['pass_code']}');\n")

        f.write("\nCOMMIT;\n")

    print(f"[SUCCESS] Generated 50 Employees, {len(vendors)} Vendors, {len(logs)} Wellness Logs, {len(appts)} Appointments, {len(usage)} Service Usage rows, {len(events)} Events, {len(registrations)} Registrations.")
    print(f"[SUCCESS] Exported PostgreSQL script to: {sql_path}")
    print("\n--- RECOMMENDATION ENGINE RULE VALIDATION REPORT ---")
    for r_name, r_cnt in rule_counts.items():
        print(f"  ✓ Rule [{r_name}]: Triggered by {r_cnt} employees (Target >= 5)")

    print("\n" + "=" * 95)
    print(f"{'EMP ID':<8} | {'EMPLOYEE NAME':<22} | {'PROFILE':<20} | {'SLEEP':<5} | {'HYD':<4} | {'MOOD':<4} | {'TRIGGERED RULES'}")
    print("=" * 95)
    for row in qa_summary[:15]:
        print(f"{row['employee_id']:<8} | {row['full_name']:<22} | {row['profile']:<20} | {row['avg_sleep']:<5} | {row['avg_hyd']:<4} | {row['avg_mood']:<4} | {row['triggered_rules']}")
    print("... (total 50 employees validated)")
    print("=" * 95)

if __name__ == "__main__":
    main()
