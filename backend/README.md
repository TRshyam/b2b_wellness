# XYZ Corporate Wellness Dashboard — Backend API (Vercel Deployment Guide) 🐍⚡

This directory contains the **FastAPI + Python** serverless backend API for the XYZ Corporate Wellness Dashboard.

---

## 1. Vercel Serverless Architecture

The backend is configured as a **Vercel Python Serverless Function**:
- **Entry Point**: `api/index.py` (located at project root)
- **FastAPI Core**: `backend/main.py`
- **Vercel Config**: `vercel.json` (defines routing rewrites and edge CORS headers)
- **Database**: Portable SQLite (`/tmp/wellness.db` auto-copy on cold start) or PostgreSQL.

---

## 2. Environment Variables

Configure the following environment variables in your Vercel Project Settings (**Settings → Environment Variables**):

| Variable Name | Required | Description | Example Value |
| :--- | :--- | :--- | :--- |
| `JWT_SECRET` | Recommended | Secret key for JWT token encoding/decoding | `xyz-corporate-wellness-dashboard-secret-key-2026` |
| `VERCEL` | Auto-set | Set automatically by Vercel serverless environment | `1` |

---

## 3. How to Deploy Backend to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Log in to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from Project Root**:
   ```bash
   cd /home/shyam/Desktop/Codind/b2b_wellness
   vercel
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

---

### Option B: Deploy via Vercel Web Dashboard (GitHub Integration)

1. Push your repository to GitHub.
2. Go to **[https://vercel.com/new](https://vercel.com/new)** and import your GitHub repository.
3. **Framework Preset**: Select **Other**.
4. **Root Directory**: Select project root `./`.
5. **Build & Development Settings**:
   - Build Command: *(leave blank - Vercel Python builder uses `@vercel/python` automatically)*
   - Output Directory: *(leave blank)*
6. **Environment Variables**: Add `JWT_SECRET`.
7. Click **Deploy**.

---

## 4. Disabling Deployment Protection for Public API Access

If your Vercel deployment returns HTTP 401 or `CORS preflight redirect` errors:
1. Open your project in the **[Vercel Dashboard](https://vercel.com/)**.
2. Go to **Settings → Deployment Protection**.
3. Change **Vercel Authentication** from **Standard Protection** to **Disabled**.
4. Click **Save**.

---

## 5. Local Testing

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 database/seed_data.py
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
```
- API Docs live at `http://localhost:8000/docs`.
