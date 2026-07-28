# Master Vercel Deployment Guide — Corporate Wellness Dashboard 🚀

This document provides a step-by-step master guide for deploying both the **FastAPI Backend** and **React Frontend** to Vercel independently.

---

## Table of Contents
1. [Backend Deployment Step-by-Step](#1-backend-deployment-step-by-step)
2. [Frontend Deployment Step-by-Step](#2-frontend-deployment-step-by-step)
3. [Vercel Deployment Protection Troubleshooting](#3-vercel-deployment-protection-troubleshooting)
4. [Verification & Verification Commands](#4-verification--verification-commands)

---

## 1. Backend Deployment Step-by-Step

### Step 1: Verify Root Configuration Files
Ensure the repository root contains:
- `vercel.json` (defines routing rewrites and edge CORS headers)
- `api/index.py` (Vercel serverless entry point)
- `requirements.txt` (Python dependencies)

### Step 2: Deploy Backend using Vercel CLI
```bash
cd /home/shyam/Desktop/Codind/b2b_wellness

# Log in to Vercel CLI
vercel login

# Deploy preview build
vercel

# Deploy production build
vercel --prod
```

### Step 3: Set Environment Variables in Vercel
In Vercel Dashboard → **Project Settings → Environment Variables**:
- `JWT_SECRET`: `xyz-corporate-wellness-dashboard-secret-key-2026`

---

## 2. Frontend Deployment Step-by-Step

### Step 1: Deploy Frontend using Vercel CLI
```bash
cd /home/shyam/Desktop/Codind/b2b_wellness/frontend

# Deploy frontend to Vercel
vercel --prod
```

### Step 2: Link Frontend to Deployed Backend URL
In Vercel Dashboard → **Frontend Project Settings → Environment Variables**:
- `VITE_API_URL`: `https://your-backend-project.vercel.app/api`

---

## 3. Vercel Deployment Protection Troubleshooting

If your frontend displays a CORS or 401 Unauthorized preflight error when connecting to the Vercel API:

1. Open **[https://vercel.com/dashboard](https://vercel.com/dashboard)**.
2. Select your Backend Project.
3. Go to **Settings → Deployment Protection**.
4. Set **Vercel Authentication** to **Disabled**.
5. Click **Save**.

---

## 4. Verification & Verification Commands

### Test Deployed Backend via Python Script
```bash
python3 -c "
import urllib.request, json
url = 'https://your-backend-project.vercel.app/api/auth/login'
data = json.dumps({'email': 'priya.ramesh@xyz.com', 'password': 'Password123!'}).encode()
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req) as resp:
    print('Backend Response Status:', resp.status)
"
```

### Test Local Frontend Build
```bash
cd frontend
npm run build
```
