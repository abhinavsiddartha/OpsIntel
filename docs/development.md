# OpsIntel Local Development & Deployment Guide

## Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: 18.x or 20.x+
- **npm** or **pnpm**
- **Git**

---

## 1. Quick Start (Local Monorepo)

### Clone & Setup
```bash
git clone https://github.com/your-org/opsintel.git
cd opsintel
```

### Backend Setup
```bash
# Setup Python Virtual Environment (optional)
python -m venv venv
source venv/bin/activate  # On Windows: .env\Scripts\Activate

# Install Dependencies
pip install -r apps/api/requirements.txt
pip install pytest httpx

# Run Test Suite
pytest apps/api/tests/test_backend.py -v

# Start FastAPI Development Server
python -m uvicorn app.main:app --app-dir apps/api --reload --port 8000
```
API Documentation will be live at `http://localhost:8000/docs`.

### Frontend Setup
```bash
cd apps/web
npm install
npm run dev
```
Web application will be live at `http://localhost:3000`.

---

## 2. Docker Deployment

Launch the entire stack with Docker Compose:
```bash
docker-compose up --build -d
```
- Web Application: `http://localhost:3000`
- REST API & Swagger: `http://localhost:8000/docs`

---

## 3. Default Demo Credentials
- **Admin**: `admin@opsintel.ai` / `AdminPass123!`
- **Manager**: `sarah.chen@opsintel.ai` / `ManagerPass123!`
- **Analyst**: `marcus.vance@opsintel.ai` / `AnalystPass123!`
- **Sales Rep**: `elena.rostova@opsintel.ai` / `SalesPass123!`
