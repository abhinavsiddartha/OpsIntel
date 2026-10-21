import os
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

readme_content = """# OpsIntel ⚡
### AI-Powered Enterprise Business Operations Intelligence Platform

[![CI/CD Pipeline](https://github.com/opsintel/opsintel/actions/workflows/ci.yml/badge.svg)](https://github.com/opsintel/opsintel)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014%20(App%20Router)-black?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2F%20Python%203.10-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/ML%20Engine-Scikit--Learn%20%2B%20SciPy-F7931E?style=flat&logo=scikit-learn)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

OpsIntel is a full-stack, enterprise-grade business operations intelligence SaaS platform. It combines real-time transaction processing, mathematical & machine learning predictive models, an embedded Retrieval-Augmented Generation (RAG) knowledge engine, and an interactive Business AI Copilot.

---

## 🌟 Key Features

### 📊 1. Enterprise Operations & Analytics Dashboard
- **Top-line KPIs**: ARR, MRR, Active Accounts, Average Order Value (AOV), Lead Velocity, Gross Margins, and Team Quota Attainment.
- **Interactive Multi-Horizon Forecasting**: 30-day, 60-day, 90-day, and 180-day revenue projections with parametric 95% confidence bands ($y \pm 1.96 \cdot \sigma$).
- **Live Anomaly Detection**: Automated flagging of sudden revenue deviations, margin collapses, and customer churn spikes.

### 🤖 2. 6 Production Machine Learning Engines
1. **Multi-Horizon Sales Forecasting** (`ARIMA` / Seasonal Trend Decomposition + Linear Regression)
2. **Customer Churn Risk Model** (`Logistic Regression` / `Gradient Boosting` with SHAP-like factor explainability)
3. **Inventory Stockout & Lead-Time Replenishment** (Demand Velocity Modeling + Economic Order Quantity `EOQ`)
4. **Target Attainment Monte Carlo Simulator** (1,000 Stochastic Iterations for quota confidence percentiles)
5. **Statistical & Outlier Anomaly Detection** (Multi-variable $Z$-Score + Isolation Forest)
6. **Customer RFM Segmentation** ($K$-Means Clustering mapping Champions, Regulars, Potential, and At Risk tiers)

### 🧠 3. Business AI Copilot with Real Database Query Reasoning
- Natural language intent parsing into dynamic SQL and metric aggregations.
- In-memory pure-Python vector search (`TF-IDF` / Cosine similarity) over corporate SOPs, sales playbooks, and strategic memos.
- Synthesized executive responses with embedded markdown tables, metric breakdowns, and exact document citations.

### 🛡️ 4. Enterprise-Grade Security & Governance
- Role-Based Access Control (**RBAC**) for `ADMIN`, `MANAGER`, `ANALYST`, and `SALES_EXECUTIVE`.
- Salted `Bcrypt` password hashing and `JWT` bearer token lifecycle management.
- Full immutable administrative audit trail and comprehensive system telemetry.

---

## 🏗️ Architecture

```mermaid
graph TD
    Client["Client Web App (Next.js 14 / TypeScript / Tailwind)"]
    API["FastAPI Gateway (/api/v1)"]
    Auth["JWT Authentication & RBAC Filter"]
    DB[(SQLite / PostgreSQL ORM)]
    ML["Scikit-Learn ML Engines"]
    RAG["Vector Store & Document Chunker"]
    Copilot["Business AI Decision Engine"]

    Client -->|REST API & Bearer JWT| API
    API --> Auth
    API --> DB
    API --> ML
    API --> RAG
    API --> Copilot
    Copilot --> DB
    Copilot --> RAG
    Copilot --> ML
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.10+
- **Node.js**: 18.x or 20.x+
- **npm** or **pnpm**

### 1. Run Backend API
```bash
# Clone repository
git clone https://github.com/your-username/opsintel.git
cd opsintel

# Install Python dependencies
pip install -r apps/api/requirements.txt
pip install pytest httpx

# Run Test Suite (100% Passing)
pytest apps/api/tests/test_backend.py -v

# Start API Server (Runs on http://localhost:8000)
python -m uvicorn app.main:app --app-dir apps/api --reload --port 8000
```
Interactive OpenAPI / Swagger Docs are available at: `http://localhost:8000/docs`.

### 2. Run Frontend Web Application
```bash
cd apps/web
npm install
npm run dev
```
Open `http://localhost:3000` to launch the platform.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@opsintel.ai` | `AdminPass123!` | System Settings, User RBAC, ML Registry, Audit Logs |
| **Manager** | `sarah.chen@opsintel.ai` | `ManagerPass123!` | Targets, Team Quotas, Reorders, Reports |
| **Analyst** | `marcus.vance@opsintel.ai` | `AnalystPass123!` | Analytics, Forecasts, Copilot, Knowledge Base |
| **Sales Rep** | `elena.rostova@opsintel.ai` | `SalesPass123!` | Sales Orders, Customers, Personal Quota |

---

## 🐳 Docker Deployment

To launch the full stack with a single command:
```bash
docker-compose up --build -d
```
- **Web UI**: `http://localhost:3000`
- **FastAPI API**: `http://localhost:8000/docs`

---

## 📚 Documentation Index

- [System Architecture](docs/architecture.md)
- [Database Schema & Models](docs/database.md)
- [REST API Reference](docs/api.md)
- [Machine Learning Models & Algorithms](docs/ml.md)
- [Business AI Copilot](docs/ai.md)
- [RAG Vector Search](docs/rag.md)
- [Security & RBAC](docs/security.md)
- [Development & Deployment](docs/development.md)

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
"""

with open(BASE / "README.md", "w", encoding="utf-8") as f:
    f.write(readme_content.strip() + "\n")
print("Wrote README.md")
