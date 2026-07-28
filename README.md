# XYZ Corporate Wellness Dashboard v2 🌿✨

> **Enterprise B2B Corporate Wellness SaaS Platform**  
> *A deterministic, rule-based wellness intelligence dashboard built for corporate employee health management, benefit tracking, and targeted intervention delivery.*

---

## Live Production Vercel Backend Integration
- **Live Deployed Vercel API**: `https://b2b-wellness-bh3d.vercel.app/api`
- **Verification Status**: 100% Operational, Authenticating with JWT Tokens, returning Snapshot, Recommendations, and v2 Intelligence Engine data.
- **Centralized API Architecture**: Configured in [src/config/api.js](file:///home/shyam/Desktop/Codind/b2b_wellness/frontend/src/config/api.js) supporting environment variable overrides via `VITE_API_URL`.

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

### v2 Enterprise Intelligence & Theme Enhancements
- **Light & Dark Theme Engine**: 100% theme parity with instant switching, smooth 150–250ms transitions, `localStorage` persistence, and 3 elevation levels (`card-elevation-1`, `card-elevation-2`, `card-elevation-3`).
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
| **Build Tool** | Vite | Lightning-fast HMR dev server and optimized production bundling (built in ~310ms). |
| **Backend API (Deployed)** | Python 3.12 + FastAPI on Vercel | High-performance serverless REST API (`https://b2b-wellness-bh3d.vercel.app/api`). |
| **Security & Auth** | PyJWT + Bcrypt | Direct bcrypt password hashing and stateless JWT Bearer token authorization. |
| **Database (Dev/Prod)** | SQLite / PostgreSQL | Portable SQL schema; SQLite with `PRAGMA foreign_keys = ON` for local sandbox, 100% portable to PostgreSQL on Vercel. |
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
                 HTTP / REST API (https://b2b-wellness-bh3d.vercel.app/api)
                                         │
+----------------------------------------v------------------------------------------+
|                        VERCEL SERVERLESS BACKEND API                              |
|                   (https://b2b-wellness-bh3d.vercel.app/api)                      |
|                                                                                   |
|   +-----------------------+  +------------------------+  +--------------------+   |
|   |    Auth Middleware    |  |  Protected Dashboard   |  |   v2 Intelligence  |   |
|   |  (PyJWT & Bcrypt)     |  |       Endpoints        |  |   Engine Module    |   |
|   +-----------------------+  +------------------------+  +--------------------+   |
+----------------------------------------┬------------------------------------------+
                                         │
                                 SQL Queries (SQLite / PostgreSQL)
                                         │
+----------------------------------------v------------------------------------------+
|                              RELATIONAL DATABASE                                  |
|       employees, employee_wellness_logs, appointments, service_usage,             |
|                  vendors, services, events, event_registrations                   |
+-----------------------------------------------------------------------------------+
```

---

## 5. Setup & Installation

### Step-by-Step Installation

```bash
cd frontend

# Install dependencies
npm install

# Start Vite React dev server
npm run dev -- --host 0.0.0.0 --port 5173
```
*Frontend connects to `https://b2b-wellness-bh3d.vercel.app/api` by default.*
