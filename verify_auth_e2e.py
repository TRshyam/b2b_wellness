import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8000/api"


def http_post(url, body, token=None):
    data = json.dumps(body).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    if token:
        req.add_header('Authorization', f'Bearer {token}')
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))

def http_get(url, token=None):
    req = urllib.request.Request(url)
    if token:
        req.add_header('Authorization', f'Bearer {token}')
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(body)
        except Exception:
            return e.code, {"detail": body}

print("=== STARTING LIVE AUTHENTICATION END-TO-END VERIFICATION ===")

# 1. Unauthenticated Request Check
code, data = http_get(f"{BASE_URL}/dashboard/wellness-snapshot")
assert code == 401, f"Expected 401 for unauthenticated request, got {code}"
print("[OK] Unauthenticated request correctly rejected with HTTP 401")

# 2. Login Priya Ramesh (E023)
code, login_priya = http_post(f"{BASE_URL}/auth/login", {"email": "priya.ramesh@xyz.com", "password": "Password123!"})
assert code == 200, f"Priya login failed: {login_priya}"
token_priya = login_priya["access_token"]
assert login_priya["employee"]["employee_id"] == "E023"
print("[OK] Priya Ramesh (E023) logged in successfully with JWT token")

# 3. Fetch E023 Dashboard with JWT
code, snap_priya = http_get(f"{BASE_URL}/dashboard/wellness-snapshot", token_priya)
assert code == 200, f"Snapshot failed: {snap_priya}"
assert snap_priya["avg_sleep_hours"] == 5.6
assert snap_priya["avg_hydration_glasses"] == 4.2
print("[OK] E023 Snapshot verified with JWT token")

code, recs_priya = http_get(f"{BASE_URL}/dashboard/recommendations", token_priya)
assert code == 200
rec_ids = [r["rule_id"] for r in recs_priya["recommendations"]]
assert "THERMAL_SPA_SAUNA" in rec_ids and "HYDRATION_CONSULT" in rec_ids
print("[OK] E023 Recommendations match Spec Scenario 1")

# 4. First Time Setup for Sarah Jenkins (EMP-014)
code, login_sarah = http_post(f"{BASE_URL}/auth/login", {"email": "sarah.jenkins@xyz.com"})
assert code == 200
assert login_sarah.get("first_time_setup") is True
assert login_sarah["employee_id"] == "EMP-014"
print("[OK] First-time setup flag returned for Sarah Jenkins (EMP-014)")

# Create password for Sarah Jenkins
code, create_sarah = http_post(f"{BASE_URL}/auth/create-password", {
    "employee_id": "EMP-014",
    "new_password": "SarahPassword123!"
})
assert code == 200
token_sarah = create_sarah["access_token"]
print("[OK] Password created for Sarah Jenkins & JWT token issued")

# 5. Fetch EMP-014 Dashboard with Sarah's JWT
code, recs_sarah = http_get(f"{BASE_URL}/dashboard/recommendations", token_sarah)
assert code == 200
assert recs_sarah["recommendations"][0]["rule_id"] == "SLEEP_COACHING"
print("[OK] EMP-014 Recommendations match Spec Scenario 2")

# 6. Verify Isolation between Priya and Sarah
code, appts_priya = http_get(f"{BASE_URL}/dashboard/upcoming-appointments", token_priya)
code, appts_sarah = http_get(f"{BASE_URL}/dashboard/upcoming-appointments", token_sarah)
for a in appts_priya:
    assert a["employee_id"] == "E023"
for a in appts_sarah:
    assert a["employee_id"] == "EMP-014"
print("[OK] JWT Token Authorization strictly isolates multi-tenant records")

print("\n>>> ALL LIVE AUTHENTICATION E2E CHECKS PASSED SUCCESSFULLY! <<<")
