import json
import urllib.request

BASE_URL = "http://localhost:8000/api"

# Login Priya Ramesh
req = urllib.request.Request(f"{BASE_URL}/auth/login", data=json.dumps({"email": "priya.ramesh@xyz.com", "password": "Password123!"}).encode('utf-8'), headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req) as resp:
    token_priya = json.loads(resp.read().decode('utf-8'))["access_token"]

# Fetch v2 intelligence
req = urllib.request.Request(f"{BASE_URL}/dashboard/v2-intelligence", headers={'Authorization': f'Bearer {token_priya}'})
with urllib.request.urlopen(req) as resp:
    v2_priya = json.loads(resp.read().decode('utf-8'))

print("=== PRIYA RAMESH (E023) V2 INTELLIGENCE OUTPUT ===")
print("Wellness Score:", v2_priya["wellness_score"], f"({v2_priya['health_category']})")
print("Sub-scores:", v2_priya["sub_scores"])
print("Persona:", v2_priya["persona"]["name"], "->", v2_priya["persona"]["tagline"])
print("Forecast:", v2_priya["forecast"])
print("Badges Unlocked:", [b["title"] for b in v2_priya["achievements"] if b["earned"]])
print("Weekly Insights:", v2_priya["weekly_insights"])
print("Dept Benchmarks (sample):", v2_priya["department_benchmarks"][:2])
print("\n>>> ALL V2 INTELLIGENCE MODULES OPERATIONAL! <<<")
