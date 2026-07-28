# XYZ Corporate Wellness Dashboard v2 🌿✨

> **Enterprise B2B Corporate Wellness SaaS Platform**  
> *A deterministic, rule-based wellness intelligence dashboard built for corporate employee health management, benefit tracking, and targeted intervention delivery.*

---

## Table of Contents
- [1. Project Overview](#1-project-overview)
- [2. Key Features](#2-key-features)
- [3. Tech Stack](#3-tech-stack)
- [4. Architecture Overview](#4-architecture-overview)
- [5. Deterministic Logic — Explained in Plain Language](#5-deterministic-logic--explained-in-plain-language)
- [6. Data Model](#6-data-model)
- [7. Setup & Installation](#7-setup--installation)
- [8. Running the Validated Demo Scenarios](#8-running-the-validated-demo-scenarios)
- [9. Project Structure](#9-project-structure)
- [10. Testing & Regression Validation](#10-testing--regression-validation)
- [11. Known Limitations & Demo Scope](#11-known-limitations--demo-scope)
- [12. Future Roadmap](#12-future-roadmap)

---

## 1. Project Overview

The **XYZ Corporate Wellness Dashboard** is a full-stack, enterprise-grade B2B wellness web application designed as a prototype and client demonstration platform. It solves the critical corporate challenge of low wellness benefit engagement by providing employees with personalized, privacy-first health tracking and rule-driven interventions, while providing corporate leaders with anonymized, aggregate workforce vitality benchmarks.

The application natively supports **9 core corporate wellness service categories**:
1. 💆 **Massage Therapy**: Deep tissue recovery, stress reduction, and posture relief.
2. 🥗 **Organic Food Services**: Fresh, healthy meal vouchers and corporate catering.
3. 📋 **Diet Planning**: Personalized nutritional roadmaps and meal strategies.
4. 🍎 **Nutrition Consultations**: 1-on-1 metabolic health and gut microbiome evaluations.
5. ♨️ **Thermal Spa Access**: Hydrotherapy and mineral springs day passes.
6. 🧖 **Sauna & Detox**: Infrared and traditional cedar sauna sessions.
7. 🩺 **Ayurvedic Doctor Consults**: Holistic health assessments and dosha evaluation.
8. 🏢 **On-Premise Events**: Corporate workshops, leadership seminars, and ergonomics clinics.
9. 🧘 **Yoga & Mindfulness**: Online, offline, and on-premise restorative yoga and breathwork.

---

## 2. Key Features

### Core Dashboard Components
- **My Wellness Snapshot**: A 14-day rolling window displaying Sleep Quality, Hydration Intake, Healthy Nutrition Compliance, Emotional Vitality, Heart Rate Variability (HRV), and Active Energy with trend percentage deltas.
- **Recommended For You**: A focal point recommendation card delivering targeted wellness interventions based on identified physiological gaps (e.g. *Thermal Spa/Sauna*, *Sleep Coaching*, *Hydration Consult*).
- **My Upcoming Appointments**: Confirmed 1:1 sessions featuring vendor avatars, duration tags, location details, and interactive quick actions (`Join`, `Reschedule`, `Cancel`).
- **Events & Workshops Timeline**: A vertical connected node timeline organized into `Upcoming`, `Completed`, and `Missed` tabs with passcode verification tracking.
- **My Service Usage Summary**: A 90-day benefit engagement breakdown across all 9 wellness categories with progress bars and automated *"Zero Usage"* blind spot flags.

### v2 Enterprise Intelligence Enhancements
- **Overall Wellness Score (0–100)**: A single composite health index categorized as *Excellent* (90-100), *Healthy* (75-89), *Moderate* (60-74), or *Needs Attention* (<60).
- **Wellness Persona Badge**: Human-readable health profile assignment (*Sleep Improver*, *Hydration Builder*, *Stress Recoverer*, *Fitness Starter*, *Balanced Performer*).
- **Achievement Gallery**: Interactive badge gallery tracking earned & locked wellness streaks (*Sleep Streak*, *Hydration Champion*, *Nutrition Explorer*, *Consistency Master*).
- **30-Day Wellness Forecast**: Additive potential score improvement indicator showing attainable score gains.
- **Weekly Narrative Insights**: Rule-based weekly progress summaries highlighting sleep deltas and hydration compliance.
- **50-Day Activity Calendar Heatmap**: Interactive logging grid displaying daily tracking consistency from June 5 to July 24, 2026.
- **Anonymous Department Benchmarks**: Department average wellness scores protected by a minimum 5-employee privacy threshold.
- **Aura AI Assistant Panel**: Template-based AI coach giving daily guidance based on current persona status.

---

## 3. Tech Stack

| Layer | Technology | Why It Was Chosen |
| :--- | :--- | :--- |
| **Frontend** | React 18 | Declarative component model, fast Virtual DOM, responsive state management. |
| **Styling & Design** | Tailwind CSS v4 | Rapid utility-first styling with custom design tokens (Inter & Geist fonts, glassmorphism accents, slate cards). |
| **Icons** | Lucide React | Modern, lightweight, accessible SVG icon system. |
| **Build Tool** | Vite | Lightning-fast HMR dev server and optimized production bundling (built in ~350ms). |
| **Backend Framework** | Python 3.12 + FastAPI | High-performance asynchronous REST API, auto-generated OpenAPI documentation, fast execution. |
| **Web Server** | Uvicorn | Production-ready ASGI server for FastAPI. |
| **Security & Auth** | PyJWT + Bcrypt | Direct bcrypt password hashing and stateless JWT Bearer token authorization. |
| **Database (Dev/Prod)** | SQLite / PostgreSQL | Portable SQL schema; SQLite with `PRAGMA foreign_keys = ON` for local sandbox, 100% portable to PostgreSQL. |
| **Data Generation** | Python Faker | Seed 42 deterministic dataset generator creating 2,500 daily wellness logs. |

---

## 4. Architecture Overview

### System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT BROWSER                                   |
|                        React 18 + Tailwind CSS + Lucide Icons                     |
|                   (Stored JWT in localStorage / Bearer Header)                    |
+-----------------------------------------------------------------------------------+
                                         │
                                   HTTP / REST API
                                         │
+----------------------------------------v------------------------------------------+
|                                FASTAPI BACKEND SERVER                             |
|                                     (Port 8000)                                   |
|                                                                                   |
|   +-----------------------+  +------------------------+  +--------------------+   |
|   |    Auth Middleware    |  |  Protected Dashboard   |  |   v2 Intelligence  |   |
|   |  (PyJWT & Bcrypt)     |  |       Endpoints        |  |   Engine Module    |   |
|   +-----------------------+  +------------------------+  +--------------------+   |
+----------------------------------------┬------------------------------------------+
                                         │
                                 SQL Queries (SQLite)
                                         │
+----------------------------------------v------------------------------------------+
|                              RELATIONAL DATABASE (wellness.db)                    |
|       employees, employee_wellness_logs, appointments, service_usage,             |
|                  vendors, services, events, event_registrations                   |
+-----------------------------------------------------------------------------------+
```

### Relational Database Tables & Purpose

1. `employees`: Stores 50 corporate employee records, login credentials, work mode, and health targets.
2. `employee_wellness_logs`: Contains 2,500 daily logs (50 days per employee) tracking sleep, hydration, mood, food, HRV, energy, and stress.
3. `appointments`: Stores 139 1:1 sessions referencing employees, services, vendors, dates, locations, and booking statuses.
4. `service_usage`: Stores 90-day cumulative session counts per category used for blind spot detection.
5. `vendors`: Stores 18 wellness service vendors with location, contact info, ratings, and specialties.
6. `services`: Stores 12 structured wellness service definitions with duration and category mappings.
7. `events`: Stores 5 group workshops and leadership retreats.
8. `event_registrations`: Stores 28 event registration records with passcode tracking and attendance statuses (`REGISTERED`, `ATTENDED`, `MISSED`).

---

## 5. Deterministic Logic — Explained in Plain Language

> **IMPORTANT STATEMENT**: This system uses **100% deterministic, rule-based logic — NOT machine learning**. All scores, recommendations, personas, forecast gains, and insights are computed using fixed mathematical formulas and explicit logic trees, guaranteeing 100% reproducible results.

### A. Recommendation Engine (Fixed Priority Rules)
Evaluates physiological logs (last 14 days) and service usage gaps in strict sequential priority order:
1. **Rule 1 (`THERMAL_SPA_SAUNA`)**: IF `avg_sleep < 6.0 hrs` AND `thermal_spa + sauna usage in 30d == 0`.
2. **Rule 2 (`SLEEP_COACHING`)**: IF `avg_sleep < 6.0 hrs` AND `sleep_coaching sessions == 0`.
3. **Rule 3 (`HYDRATION_CONSULT`)**: IF `avg_hydration < 6.0 glasses/day`.
4. **Rule 4 (`MOOD_MINDFULNESS`)**: IF `mood_trend == "Declining"`.
5. **Rule 5 (`FITNESS_YOGA`)**: IF `yoga usage in 30d == 0`.

*Worked Example — Priya Ramesh (E023)*:
- Avg Sleep: **5.6 hrs** (< 6.0)
- Spa/Sauna Usage: **0 sessions**
- Avg Hydration: **4.2 glasses** (< 6.0)
- **Output**: Priority #1: `Thermal Spa or Sauna Session` | Priority #2: `Nutrition & Hydration Consultation`.

*Worked Example — Sarah Jenkins (EMP-014)*:
- Avg Sleep: **5.8 hrs** (< 6.0)
- Sauna Usage: **3 sessions** (> 0)
- Sleep Coaching Sessions: **0 sessions**
- **Output**: Priority #1: `Sleep Coaching Consultation`.

---

### B. Wellness Score Calculation (0–100)
Normalizes sub-metrics to 0–100 before applying a weighted sum. Days with missing logs are excluded from average denominators rather than zero-filled.

- **Sleep Sub-score**: $\min\left(100.0, \frac{\text{avg\_sleep\_hours}}{\text{target\_sleep\_hours}} \times 100.0\right)$ *(Target = 8.0 hrs)*
- **Hydration Sub-score**: Normalize to glasses ($\text{hydration\_glasses}$ or $\frac{\text{hydration\_oz}}{8.0}$). $\min\left(100.0, \frac{\text{avg\_hydration\_glasses}}{\text{target\_hydration\_glasses}} \times 100.0\right)$ *(Target = 8.0 glasses)*
- **Mood Sub-score**: $\frac{\text{avg\_mood\_score}}{5.0} \times 100.0$
- **Nutrition Sub-score**: $\frac{\text{healthy\_food\_logged\_days}}{14.0} \times 100.0$
- **Exercise Sub-score**: $\min\left(100.0, \frac{\text{avg\_daily\_exercise\_mins}}{21.4} \times 100.0\right)$ *(Target = 150 min/week)*
- **Stress Sub-score**: $\frac{5.0 - \text{avg\_stress\_level}}{4.0} \times 100.0$

$$\text{Wellness Score} = \text{round}(0.30 \times \text{Sleep} + 0.20 \times \text{Hydration} + 0.20 \times \text{Mood} + 0.15 \times \text{Nutrition} + 0.10 \times \text{Exercise} + 0.05 \times \text{Stress})$$

*Worked Example — Priya Ramesh (E023)*:
- Sleep: 5.6 / 8.0 = 70.0 (wt: 21.0)
- Hydration: 4.2 / 8.0 = 52.5 (wt: 10.5)
- Mood: 3.4 / 5.0 = 68.0 (wt: 13.6)
- Nutrition: 9 / 14 = 64.3 (wt: 9.6)
- Exercise: 30.0 / 21.4 = 100.0 (wt: 10.0)
- Stress: (5 - 4) / 4 = 25.0 (wt: 1.25)
- **Total Wellness Score**: **66** (*Moderate*).

---

### C. Wellness Persona Assignment (Tie-Breaking Order)
Evaluated sequentially; the first matching condition assigns the persona:
1. `Sleep Improver`: IF `avg_sleep_hours < 7.0`
2. `Hydration Builder`: ELSE IF `avg_hydration_glasses < 7.0`
3. `Stress Recoverer`: ELSE IF `avg_stress_level >= 3` OR `mood_trend == "Declining"`
4. `Fitness Starter`: ELSE IF `avg_daily_exercise_mins < 20.0`
5. `Balanced Performer`: ELSE (all goals met)

*Worked Example — Priya Ramesh (E023)*:
- `avg_sleep_hours = 5.6` (< 7.0) $\rightarrow$ Assigned **`Sleep Improver`**.

---

### D. Achievement & Badge Thresholds
- **Sleep Streak (7 days)**: `sleep_hours >= 7.0` for 7 consecutive logged days.
- **Hydration Champion (7 days)**: `hydration_glasses >= 7.0` for 7 consecutive logged days.
- **Nutrition Explorer (10 of 14 days)**: `healthy_food_logged == 1` on at least 10 of last 14 logged days.
- **Consistency Master (30 days)**: `sleep >= 7.0`, `hydration >= 7.0`, and `healthy_food == 1` on at least 25 of last 30 logged days.

---

### E. Wellness Forecast Calculation
Additive score gain based on actionable gaps corresponding to active recommendations (capped at 100):
- Hydration gap (`hydration < target`): `+3 pts`
- Exercise gap (`exercise < target`): `+4 pts`
- Sleep coaching recommended / booked (`sleep < target`): `+2 pts`

*Worked Example — Priya Ramesh (E023)*:
- Current Score: **66**
- Hydration gap present: `+3 pts`
- Sleep coaching session booked: `+2 pts`
- **Forecast Score**: **71** (`66 + 5`).

---

### F. Department Benchmark Privacy Rule
- **Minimum Group Size**: Department average scores are calculated ONLY if `department_employee_count >= 5`.
- If a department has < 5 employees, output: `"Insufficient data for anonymized benchmark (minimum 5 employees required)"`.

---

## 6. Data Model

### Table: `employees`

| Field Name | Type | Description | Data Category & Sensitivity Flag |
| :--- | :--- | :--- | :--- |
| `employee_id` | TEXT (PK) | Unique employee identifier (e.g. `E023`) | Core Identifier / Low |
| `full_name` | TEXT | Employee full name | Core Functional / Low (Demo PII) |
| `email` | TEXT | Corporate email (`@xyz.com`) | Auth Identifier / Low (Demo PII) |
| `department` | TEXT | Department name | Core Metadata / Low |
| `role` | TEXT | Job title | Core Metadata / Low |
| `password_hash` | TEXT | Bcrypt hashed password | Core Auth Security / Low |
| `is_active` | INTEGER | Active status flag (1/0) | Core Auth State / Low |
| `password_created` | INTEGER | First-time setup flag (1 = active, 0 = pending setup) | Core Auth State / Low |
| `manager_name` | TEXT | Reporting manager name | Demo Metadata / Low |
| `team_name` | TEXT | Sub-team assignment | Demo Metadata / Low |
| `work_mode` | TEXT | Remote, Hybrid, or Office | Demo Metadata / Low |
| `emergency_contact_name` | TEXT | Emergency contact name | Demo Metadata / ⚠️ **High PII** |
| `emergency_contact_phone` | TEXT | Emergency contact telephone | Demo Metadata / ⚠️ **High PII** |
| `target_sleep_hours` | REAL | Daily sleep target (default 8.0) | Demo Target / Medium |
| `target_daily_hydration_liters` | REAL | Daily hydration target (default 2.5 L) | Demo Target / Medium |

---

### Table: `employee_wellness_logs`

| Field Name | Type | Description | Data Category & Sensitivity Flag |
| :--- | :--- | :--- | :--- |
| `log_id` | INTEGER (PK) | Auto-increment log ID | Core Identifier / Low |
| `employee_id` | TEXT (FK) | Employee reference | Core FK / Low |
| `log_date` | TEXT | Date string (`YYYY-MM-DD`) | Core Temporal / Low |
| `sleep_hours` | REAL | Sleep duration in hours | Core Metric / Medium (Health) |
| `hydration_glasses` | REAL | Water intake in 8oz glasses | Core Metric / Medium (Health) |
| `hydration_oz` | REAL | Water intake in ounces | Core Metric / Medium (Health) |
| `healthy_food_logged` | INTEGER | Healthy nutrition flag (1/0) | Core Metric / Medium (Health) |
| `mood_score` | REAL | Self-reported mood (1.0 to 5.0) | Core Metric / ⚠️ **High (Mental Health)** |
| `active_energy_kcal` | REAL | Active energy burned | Core Metric / Medium |
| `hrv_ms` | REAL | Heart Rate Variability in ms | Core Metric / Medium |
| `stress_level` | INTEGER | Self-reported stress (1 to 5) | Demo Metric / ⚠️ **High (Mental Health)** |
| `step_count` | INTEGER | Daily step count | Demo Metric / Medium |

---

### Table: `appointments`

| Field Name | Type | Description | Data Category & Sensitivity Flag |
| :--- | :--- | :--- | :--- |
| `appointment_id` | INTEGER (PK) | Appointment identifier | Core Identifier / Low |
| `employee_id` | TEXT (FK) | Employee reference | Core FK / Low |
| `service_id` | INTEGER (FK) | Service reference | Core FK / Low |
| `appointment_date` | TEXT | Date and time (`YYYY-MM-DD HH:MM:SS`) | Core Temporal / Low |
| `location` | TEXT | Physical room or `Online` | Core Metadata / Low |
| `status` | TEXT | `Booked`, `Completed`, `Cancelled`, `No Show` | Core State / Low |
| `confirmation_number` | TEXT | Unique booking confirmation | Demo Metadata / Low |
| `satisfaction_rating` | INTEGER | Post-session rating (1 to 5) | Demo Metadata / Low |

---

## 7. Setup & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Python**: `v3.10` or higher
- **Package Manager**: `npm` (v9+) or `yarn`

---

### Step-by-Step Installation

#### 1. Clone & Navigate
```bash
cd /home/shyam/Desktop/Codind/b2b_wellness
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment (optional)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pyjwt bcrypt faker

# Initialize and seed local database
python3 database/seed_data.py

# Start FastAPI backend server
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
```
*Backend server runs live at `http://localhost:8000`.*

#### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Start Vite React dev server
npm run dev -- --host 0.0.0.0 --port 5173
```
*Frontend application runs live at `http://localhost:5173`.*

---

### Default Credentials
- **Priya Ramesh (`E023`)**: `priya.ramesh@xyz.com` / `Password123!` *(Pre-activated Active Account)*
- **Sarah Jenkins (`EMP-014`)**: `sarah.jenkins@xyz.com` / `Password123!` *(First-Time Password Setup Flow)*
- **All 50 Employee Logins**: See [employee_credentials.txt](file:///home/shyam/Desktop/Codind/b2b_wellness/employee_credentials.txt).

---

## 8. Running the Validated Demo Scenarios

To demonstrate the validated spec scenarios:

1. Open `http://localhost:5173` in your browser.
2. **Scenario 1 — Priya Ramesh (`E023`)**:
   - Email: `priya.ramesh@xyz.com`
   - Password: `Password123!`
   - **Expected Output**: Snapshot shows **5.6 hrs avg sleep** & **4.2 glasses hydration**. Recommendation cards display **Priority #1: Thermal Spa/Sauna** and **Priority #2: Hydration Consult**. Wellness Score is **66** (*Moderate*), Persona is **Sleep Improver**.
3. **Scenario 2 — Sarah Jenkins (`EMP-014`)**:
   - Email: `sarah.jenkins@xyz.com`
   - Initial Login: Prompts for password creation (`Password123!`).
   - **Expected Output**: Snapshot shows **5.8 hrs avg sleep** & **8.0 glasses hydration**. Recommendation card displays **Priority #1: Sleep Coaching Consultation**.

---

## 9. Project Structure

```
b2b_wellness/
├── backend/
│   ├── auth.py                      # PyJWT & bcrypt security functions
│   ├── main.py                      # FastAPI application & REST endpoint routes
│   ├── test_auth.py                 # Backend auth & JWT test suite
│   ├── v2_intelligence.py           # Deterministic score, persona, badge, forecast engine
│   └── database/
│       ├── schema.sql               # Relational SQL table definitions
│       ├── seed_data.py             # Database seed runner script
│       ├── generate_postgres_seed.py  # Seed 42 dataset generator (2,500 daily logs)
│       ├── migrate_enrichment.py    # Schema metadata migration runner
│       ├── seed_postgres.sql        # Exported PostgreSQL seed file
│       └── wellness.db              # SQLite development database
├── frontend/
│   ├── src/
│   │   ├── components/              # Sidebar, Header, WellnessScoreCard, Heatmap, etc.
│   │   ├── context/                 # AuthContext.jsx (JWT state management)
│   │   ├── pages/                   # Login, CreatePassword, ForgotPassword, Profile, Settings
│   │   ├── App.jsx                  # Main application container & router
│   │   └── index.css                # Tailwind design system & typography tokens
│   ├── index.html                   # HTML template loading Inter & Geist fonts
│   ├── package.json                 # Frontend dependencies
│   └── vite.config.js               # Vite build configuration
├── employee_credentials.txt         # List of 50 employee login credentials
├── verify_auth_e2e.py               # E2E HTTP verification test script
├── test_v2_intelligence.py          # v2 intelligence module validation script
└── README.md                        # Project documentation
```

---

## 10. Testing & Regression Validation

### Live API & E2E Validation
Run the automated HTTP verification test:
```bash
python3 verify_auth_e2e.py
```
*Validates unauthenticated 401 rejection, E023 Priya Ramesh recommendations, EMP-014 Sarah Jenkins password creation & recommendations, and JWT data isolation.*

### v2 Intelligence Verification
Run the v2 intelligence engine test:
```bash
python3 test_v2_intelligence.py
```
*Validates Priya Ramesh's score (66), persona (`Sleep Improver`), forecast (+5 potential gain), and department benchmarks.*

### Frontend Production Build Test
```bash
cd frontend && npm run build
```
*Verifies 0 compilation or TypeScript/JSX errors.*

---

## 11. Known Limitations & Demo Scope

- **Mock Prototype Dataset**: Built with 50 fictional employees, 18 vendors, and 2,500 daily logs generated via `Seed = 42`.
- **No Live Wearable API Sync**: Daily logs (sleep, steps, HRV) are simulated in SQLite; integration with Apple HealthKit, Fitbit API, or Garmin Connect is not yet connected.
- **Onboarding Real Client Data Requirements**:
  1. HRIS Employee Directory Sync (Workday, SuccessFactors, or Okta SCIM).
  2. Single Sign-On (SSO) Integration (SAML 2.0 / OpenID Connect).
  3. Vendor Procurement Integration.

---

## 12. Future Roadmap

- 🔮 **SSO Integration** (*Planned*): Direct Okta / Azure Entra ID Single Sign-On integration.
- ⌚ **Direct Wearable Sync** (*Planned*): Native HealthKit & Google Health Connect sync.
- 📊 **Executive HR Analytics Portal** (*Planned*): Population-level health analytics dashboard for HR executives.
