import json
import urllib.request

BASE_URL = "http://localhost:8000/api"

def check(url, desc):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Failed {desc}: HTTP {resp.status}"
        data = json.loads(resp.read().decode('utf-8'))
        print(f"[OK] {desc}")
        return data

print("=== STARTING END-TO-END VERIFICATION ===")

# 1. Employees endpoint
employees = check(f"{BASE_URL}/employees", "GET /api/employees")
assert len(employees) >= 50, f"Expected 50 employees, got {len(employees)}"
emp_ids = [e["employee_id"] for e in employees]
assert "E023" in emp_ids and "EMP-014" in emp_ids, "Missing E023 or EMP-014"

# 2. Priya Ramesh (E023) Scenario 1
appts_e023 = check(f"{BASE_URL}/dashboard/E023/upcoming-appointments", "E023 Upcoming Appointments")
assert len(appts_e023) == 2, f"E023 expected 2 appointments, got {len(appts_e023)}"

snap_e023 = check(f"{BASE_URL}/dashboard/E023/wellness-snapshot", "E023 Wellness Snapshot")
assert snap_e023["avg_sleep_hours"] == 5.6, f"E023 sleep expected 5.6, got {snap_e023['avg_sleep_hours']}"
assert snap_e023["avg_hydration_glasses"] == 4.2, f"E023 hydration expected 4.2, got {snap_e023['avg_hydration_glasses']}"
assert snap_e023["healthy_food_logged_days"] == 9, f"E023 healthy food expected 9, got {snap_e023['healthy_food_logged_days']}"
assert snap_e023["mood_trend"] == "Declining", f"E023 mood trend expected Declining, got {snap_e023['mood_trend']}"

recs_e023 = check(f"{BASE_URL}/dashboard/E023/recommendations", "E023 Recommendations")
rec_list_e023 = recs_e023["recommendations"]
assert len(rec_list_e023) == 2, f"E023 expected 2 recommendations, got {len(rec_list_e023)}"
rule_ids_e023 = [r["rule_id"] for r in rec_list_e023]
assert "THERMAL_SPA_SAUNA" in rule_ids_e023, "E023 missing Thermal Spa recommendation"
assert "HYDRATION_CONSULT" in rule_ids_e023, "E023 missing Hydration recommendation"

events_e023 = check(f"{BASE_URL}/dashboard/E023/registered-events", "E023 Registered Events")
assert len(events_e023["upcoming"]) >= 1, "E023 expected upcoming registered event"

usage_e023 = check(f"{BASE_URL}/dashboard/E023/service-usage", "E023 Service Usage")
assert usage_e023["blind_spot_count"] > 0, "E023 expected blind spot categories"

# 3. Sarah Jenkins (EMP-014) Scenario 2
recs_emp014 = check(f"{BASE_URL}/dashboard/EMP-014/recommendations", "EMP-014 Recommendations")
rec_list_emp014 = recs_emp014["recommendations"]
assert len(rec_list_emp014) >= 1, "EMP-014 expected at least 1 recommendation"
assert rec_list_emp014[0]["rule_id"] == "SLEEP_COACHING", f"EMP-014 expected SLEEP_COACHING rule, got {rec_list_emp014[0]['rule_id']}"
assert "Sleep Coaching" in rec_list_emp014[0]["title"], "EMP-014 recommendation title mismatch"

# 4. Multi-tenant isolation verification
appts_emp014 = check(f"{BASE_URL}/dashboard/EMP-014/upcoming-appointments", "EMP-014 Upcoming Appointments")
for a in appts_e023:
    assert a["employee_id"] == "E023"
for a in appts_emp014:
    assert a["employee_id"] == "EMP-014"

print("\n>>> ALL E2E VERIFICATION CHECKS PASSED SUCCESSFULLY! <<<")
