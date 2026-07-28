import os
import sys
from fastapi.testclient import TestClient

# Ensure current dir is in path
sys.path.insert(0, os.path.dirname(__file__))

from main import app

client = TestClient(app)

def test_employees_list():
    res = client.get("/api/employees")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 50
    emp_ids = [e["employee_id"] for e in data]
    assert "E023" in emp_ids
    assert "EMP-014" in emp_ids
    print("PASS: /api/employees list test")

def test_priya_ramesh_scenario_1():
    # E023 Upcoming Appointments
    res_appts = client.get("/api/dashboard/E023/upcoming-appointments")
    assert res_appts.status_code == 200
    appts = res_appts.json()
    assert len(appts) == 2
    titles = [a["service_title"] for a in appts]
    assert "Deep Tissue Recovery Massage" in titles or "Massage Therapy" in titles or any("Massage" in t for t in titles)
    assert any("Nutrition" in t for t in titles)

    # E023 Snapshot
    res_snap = client.get("/api/dashboard/E023/wellness-snapshot")
    assert res_snap.status_code == 200
    snap = res_snap.json()
    print("DEBUG snap:", snap)
    assert snap["avg_sleep_hours"] == 5.6
    assert snap["avg_hydration_glasses"] == 4.2
    assert snap["healthy_food_logged_days"] == 9
    assert snap["mood_trend"] == "Declining"

    # E023 Recommendations
    res_recs = client.get("/api/dashboard/E023/recommendations")
    assert res_recs.status_code == 200
    recs = res_recs.json()["recommendations"]
    assert len(recs) == 2
    rule_ids = [r["rule_id"] for r in recs]
    assert "THERMAL_SPA_SAUNA" in rule_ids or "SLEEP_COACHING" in rule_ids
    assert "HYDRATION_CONSULT" in rule_ids

    print("PASS: E023 (Priya Ramesh) Scenario 1 verified against spec")

def test_sarah_jenkins_scenario_2():
    # EMP-014 Snapshot & Recommendations
    res_snap = client.get("/api/dashboard/EMP-014/wellness-snapshot")
    assert res_snap.status_code == 200
    snap = res_snap.json()
    assert snap["avg_sleep_hours"] == 5.8
    assert snap["avg_hydration_glasses"] == 8.0

    res_recs = client.get("/api/dashboard/EMP-014/recommendations")
    assert res_recs.status_code == 200
    recs = res_recs.json()["recommendations"]
    assert len(recs) >= 1
    assert recs[0]["rule_id"] == "SLEEP_COACHING"
    assert "Sleep Coaching" in recs[0]["title"]
    print("PASS: EMP-014 (Sarah Jenkins) Scenario 2 verified against spec")

def test_rule_coverage_50_employees():
    res_emps = client.get("/api/employees")
    emps = res_emps.json()
    
    triggered_rules = set()
    for e in emps:
        emp_id = e["employee_id"]
        res_recs = client.get(f"/api/dashboard/{emp_id}/recommendations")
        for r in res_recs.json()["recommendations"]:
            triggered_rules.add(r["rule_id"])

    print(f"Triggered Rule IDs across dataset: {triggered_rules}")
    expected_rules = {"SLEEP_COACHING", "THERMAL_SPA_SAUNA", "HYDRATION_CONSULT", "MOOD_MINDFULNESS", "FITNESS_YOGA"}
    assert expected_rules.issubset(triggered_rules), f"Missing rules: {expected_rules - triggered_rules}"
    print("PASS: All 5 recommendation rules are triggered across the dataset")

def test_employee_isolation():
    # Fetch E023 data
    res_e023 = client.get("/api/dashboard/E023/upcoming-appointments").json()
    # Fetch EMP-014 data
    res_emp014 = client.get("/api/dashboard/EMP-014/upcoming-appointments").json()

    for appt in res_e023:
        assert appt["employee_id"] == "E023"
    for appt in res_emp014:
        assert appt["employee_id"] == "EMP-014"

    print("PASS: Multi-tenant data isolation verified")

if __name__ == "__main__":
    test_employees_list()
    test_priya_ramesh_scenario_1()
    test_sarah_jenkins_scenario_2()
    test_rule_coverage_50_employees()
    test_employee_isolation()
    print("\nALL BACKEND VERIFICATION TESTS PASSED SUCCESSFULLY!")
