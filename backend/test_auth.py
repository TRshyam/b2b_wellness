import os
import sys
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(__file__))

from main import app

client = TestClient(app)

def test_login_success():
    res = client.post("/api/auth/login", json={
        "email": "priya.ramesh@xyz.com",
        "password": "Password123!"
    })
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    data = res.json()
    assert "access_token" in data
    assert data["employee"]["employee_id"] == "E023"
    print("PASS: Login success for Priya Ramesh (E023)")
    return data["access_token"]

def test_first_time_login_setup():
    res = client.post("/api/auth/login", json={
        "email": "sarah.jenkins@xyz.com"
    })
    assert res.status_code == 200
    data = res.json()
    assert data.get("first_time_setup") is True
    assert data["employee_id"] == "EMP-014"
    print("PASS: First-time setup detected for Sarah Jenkins (EMP-014)")

    # Create password for EMP-014
    res_create = client.post("/api/auth/create-password", json={
        "employee_id": "EMP-014",
        "new_password": "SarahPassword123!"
    })
    assert res_create.status_code == 200
    data_create = res_create.json()
    assert "access_token" in data_create
    assert data_create["employee"]["password_created"] == 1
    print("PASS: Password creation completed for EMP-014")

def test_protected_routes_unauthorized():
    res = client.get("/api/dashboard/wellness-snapshot")
    assert res.status_code == 401
    print("PASS: Protected endpoint rejected unauthenticated request with HTTP 401")

def test_protected_dashboard_data_isolation(token_e023):
    headers = {"Authorization": f"Bearer {token_e023}"}
    
    # 1. Me endpoint
    res_me = client.get("/api/auth/me", headers=headers)
    assert res_me.status_code == 200
    assert res_me.json()["employee_id"] == "E023"

    # 2. Snapshot
    res_snap = client.get("/api/dashboard/wellness-snapshot", headers=headers)
    assert res_snap.status_code == 200
    snap = res_snap.json()
    assert snap["avg_sleep_hours"] == 5.6
    assert snap["avg_hydration_glasses"] == 4.2

    # 3. Recommendations
    res_recs = client.get("/api/dashboard/recommendations", headers=headers)
    assert res_recs.status_code == 200
    recs = res_recs.json()["recommendations"]
    assert len(recs) == 2
    rule_ids = [r["rule_id"] for r in recs]
    assert "THERMAL_SPA_SAUNA" in rule_ids
    assert "HYDRATION_CONSULT" in rule_ids

    # 4. Appointments
    res_appts = client.get("/api/dashboard/upcoming-appointments", headers=headers)
    assert res_appts.status_code == 200
    appts = res_appts.json()
    for a in appts:
        assert a["employee_id"] == "E023"

    print("PASS: JWT Protected Dashboard isolated E023 data successfully")

def test_forgot_and_reset_password():
    # Forgot password
    res_forgot = client.post("/api/auth/forgot-password", json={"email": "priya.ramesh@xyz.com"})
    assert res_forgot.status_code == 200
    reset_token = res_forgot.json()["reset_token"]
    assert reset_token is not None

    # Reset password
    res_reset = client.post("/api/auth/reset-password", json={
        "token": reset_token,
        "new_password": "NewPriyaPassword123!"
    })
    assert res_reset.status_code == 200

    # Re-login with new password
    res_login = client.post("/api/auth/login", json={
        "email": "priya.ramesh@xyz.com",
        "password": "NewPriyaPassword123!"
    })
    assert res_login.status_code == 200
    print("PASS: Forgot & Reset Password workflow verified")

if __name__ == "__main__":
    token = test_login_success()
    test_first_time_login_setup()
    test_protected_routes_unauthorized()
    test_protected_dashboard_data_isolation(token)
    test_forgot_and_reset_password()
    print("\nALL AUTHENTICATION & AUTHORIZATION TESTS PASSED SUCCESSFULLY!")
