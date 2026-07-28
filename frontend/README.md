# XYZ Corporate Wellness Dashboard — Frontend (Vercel Deployment Guide) ⚛️✨

This directory contains the **React 18 + Tailwind CSS + Vite** frontend web application for the XYZ Corporate Wellness Dashboard.

---

## 1. Features & Architecture

- **Framework**: React 18 with Vite build tool.
- **Styling**: Tailwind CSS v4 with custom design tokens (`index.css`).
- **Theme Engine**: Complete Light Theme & Dark Theme parity with system preference auto-detect and `localStorage` persistence.
- **API Integration**: Centralized in `src/config/api.js` supporting environment variable configuration (`VITE_API_URL`).

---

## 2. Environment Variables

Configure the following environment variable during build:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of your deployed Vercel Backend API | `https://b2b-wellness-g3ow.vercel.app/api` |

---

## 3. How to Deploy Frontend to Vercel

### Option A: Deploy via Vercel CLI

1. Navigate to the `frontend` directory:
   ```bash
   cd /home/shyam/Desktop/Codind/b2b_wellness/frontend
   ```

2. Run Vercel CLI deploy:
   ```bash
   vercel
   ```

3. Set `VITE_API_URL` when prompted or in project settings:
   ```bash
   vercel --env VITE_API_URL=https://b2b-wellness-g3ow.vercel.app/api --prod
   ```

---

### Option B: Deploy via Vercel Web Dashboard (GitHub Integration)

1. Push your repository to GitHub.
2. Go to **[https://vercel.com/new](https://vercel.com/new)** and import your repository.
3. **Framework Preset**: Select **Vite**.
4. **Root Directory**: Select `frontend`.
5. **Build & Development Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. **Environment Variables**: Add `VITE_API_URL` set to your backend API URL (e.g. `https://b2b-wellness-g3ow.vercel.app/api`).
7. Click **Deploy**.

---

## 4. Local Development

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```
- App runs live at `http://localhost:5173`.
