import os
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
DOCS = BASE / "docs"
DOCS.mkdir(parents=True, exist_ok=True)

docs_content = {}

docs_content["architecture.md"] = """# OpsIntel Platform Architecture

## Executive Architecture Overview

OpsIntel is an enterprise-grade AI-powered business operations intelligence platform. It bridges real-time transactional enterprise data (ERP/CRM/Inventory) with predictive machine learning pipelines and a hybrid RAG-augmented business copilot.

```mermaid
graph TD
    Client["Client Web App (Next.js 14 / React / Tailwind)"]
    API["FastAPI Backend Gateway (REST /api/v1)"]
    Auth["JWT + Role-Based Access Control (RBAC)"]
    DB[(SQLite / PostgreSQL ORM)]
    ML["Scikit-Learn / SciPy ML Engines"]
    RAG["In-Memory Vector Store + Document Chunker"]
    Copilot["Business AI Decision Copilot"]

    Client -->|HTTPS / JSON| API
    API --> Auth
    API --> DB
    API --> ML
    API --> RAG
    API --> Copilot
    Copilot --> DB
    Copilot --> RAG
    Copilot --> ML
```

## System Topology & Micro-Components

### 1. Presentation Tier (`apps/web`)
- **Framework**: Next.js 14 with App Router architecture
- **Design System**: Tailored dark-mode enterprise UI inspired by Linear & Datadog
- **Component Primitives**: KPI metric cards, interactive status badges, searchable data tables with multi-filter and sort, command palette (`Cmd+K`), notification popovers, responsive navigation shell
- **Visualizations**: Recharts-based multi-horizon forecasting charts with 95% confidence intervals, customer cohort matrices, churn probability distributions, and inventory lead-time analysis

### 2. Application & API Tier (`apps/api`)
- **Runtime**: Python 3.10+ / FastAPI / Uvicorn ASGI
- **ORM & Data Layer**: SQLAlchemy 2.0 with type annotations and Alembic migration compatibility
- **Security & RBAC**: OAuth2 password flow with HMAC-SHA256 JWT tokens, granular role authorization (`admin`, `manager`, `analyst`, `sales_rep`)
- **Validation**: Pydantic v2 schemas with unified envelope response structures (`APIResponse[T]`)

### 3. Machine Learning & Statistical Inference Tier
- **Sales Forecast Engine**: Multi-horizon ARIMA/linear regression with monthly seasonality indices and 95% parametric confidence bands
- **Customer Churn Engine**: Feature importance-backed Logistic Regression/Gradient Boosting scoring customer RFM and interaction velocity
- **Stockout Prediction Engine**: Empirical daily demand rate, supplier lead-time distribution, and Economic Order Quantity (EOQ) optimization
- **Target Achievement Simulator**: 1,000-run Monte Carlo simulation modeling attainment probabilities and shortfall risks
- **Anomaly Detection**: Multivariable statistical Z-score and Isolation Forest outlier scoring on operational revenue and order volumes
- **Customer Segmentation**: RFM K-Means clustering algorithm generating distinct customer persona tiers

### 4. Hybrid AI Copilot & RAG Knowledge Engine
- **Vector Retrieval**: Custom pure-Python cosine similarity vector engine (`VectorStore`) indexing chunked operational PDFs, SOPs, and governance docs
- **Reasoning Engine**: Structured natural language intent parsing with automated database query generation, metric aggregation, anomaly synthesis, and cited executive summaries
"""

docs_content["database.md"] = """# OpsIntel Database Schema & Data Models

OpsIntel operates on a normalized relational schema modeled in SQLAlchemy 2.0.

## Entity Relationship Overview

```mermaid
erDiagram
    USERS ||--o{ AUDIT_LOGS : performs
    REGIONS ||--o{ EMPLOYEES : assigns
    REGIONS ||--o{ CUSTOMERS : locates
    CATEGORIES ||--o{ PRODUCTS : categorizes
    PRODUCTS ||--o{ INVENTORIES : tracks
    PRODUCTS ||--o{ ORDER_ITEMS : contains
    CUSTOMERS ||--o{ ORDERS : places
    EMPLOYEES ||--o{ ORDERS : manages
    ORDERS ||--o{ ORDER_ITEMS : includes
    DOCUMENTS ||--o{ DOCUMENT_CHUNKS : splits
    AI_CONVERSATIONS ||--o{ AI_MESSAGES : contains
```

## Core Tables

| Table | Purpose | Key Indexes |
| :--- | :--- | :--- |
| `users` | Enterprise user accounts, hashed passwords, RBAC roles | `email` (unique) |
| `regions` | Geographic sales territories and target allocations | `code` (unique) |
| `employees` | Sales representatives, team leads, department heads | `employee_code`, `email` |
| `categories` | Product hierarchy taxonomy | `name` (unique) |
| `products` | Enterprise hardware, software licenses, SaaS subscriptions | `sku` (unique), `category_id` |
| `inventories` | Current stock, lead time, stockout risk level, EOQ parameters | `product_id` (unique) |
| `customers` | Accounts, lifetime value, churn risk score, RFM segment | `customer_code`, `email` |
| `orders` | Sales transactions, revenue, delivery tracking, payment status | `order_number` (unique), `customer_id` |
| `order_items`| Line-item pricing, quantities, discounts, and SKU relations | `order_id`, `product_id` |
| `sales_targets`| Quarterly quotas, attainment metrics, Monte Carlo simulations | `employee_id`, `region_id` |
| `anomalies` | Detected revenue surges, supplier delays, churn outliers | `is_resolved`, `severity` |
| `documents` | Executive playbooks, supply chain SLAs, sales governance | `created_at` |
| `document_chunks`| Vector-embedded text passages for RAG retrieval | `document_id` |
| `ai_conversations`| Session threads for executive AI copilot | `user_id` |
| `ai_messages` | Full prompt, structured SQL execution, and response context | `conversation_id` |
| `audit_logs` | Security compliance and administrative audit trail | `user_id`, `created_at` |
"""

docs_content["api.md"] = """# OpsIntel REST API Reference (`/api/v1`)

All API endpoints return standard enveloped JSON responses:

```json
{
  "success": true,
  "data": { ... },
  "meta": { "timestamp": "...", "version": "1.0.0" },
  "error": null
}
```

## Authentication Endpoints
- `POST /api/v1/auth/login`: Authenticate with email/password and obtain JWT bearer token.
- `POST /api/v1/auth/register`: Register a new enterprise user.
- `GET /api/v1/auth/me`: Get current authenticated user profile and permissions.
- `POST /api/v1/auth/forgot-password`: Request password reset token.

## Analytics & Operational Intelligence
- `GET /api/v1/analytics/overview`: Top-line enterprise KPIs (ARR, MRR, Active Customers, Stockout Risk, Pipeline Attainment).
- `GET /api/v1/analytics/trends`: Monthly revenue, margin, and order volume time-series.
- `GET /api/v1/analytics/anomalies`: Current unacknowledged operational anomalies and alerts.

## Sales & Transactions
- `GET /api/v1/sales/orders`: Paginated list of sales orders with multi-filter (status, region, date range).
- `GET /api/v1/sales/orders/{id}`: Detailed line items and customer account information.
- `POST /api/v1/sales/orders`: Create a new transactional order.
- `GET /api/v1/sales/pipeline`: Pipeline funnel analysis across sales stages.

## Machine Learning Endpoints
- `GET /api/v1/ml/sales-forecast`: Multi-horizon (30, 60, 90, 180 day) predictive forecast with confidence intervals.
- `GET /api/v1/ml/churn-risk`: Customer churn risk scores, risk tier breakdown, and top predictive factors.
- `GET /api/v1/ml/stockout-risk`: Inventory depletion forecasts, estimated days to stockout, and recommended EOQ reorders.
- `GET /api/v1/ml/target-simulation`: Monte Carlo simulation of team quota attainment probabilities.
- `GET /api/v1/ml/customer-segments`: RFM K-Means clustering distribution and segment characteristics.
- `GET /api/v1/ml/registry`: Health and telemetry of active ML models.

## AI Copilot & RAG Endpoints
- `POST /api/v1/ai/chat`: Interactive business reasoning copilot with query generation and synthesized answers.
- `GET /api/v1/ai/history`: Fetch conversation history.
- `GET /api/v1/rag/search`: Cosine-similarity vector search across enterprise knowledge base.
- `POST /api/v1/rag/upload`: Ingest and chunk new enterprise PDF/text documents.
- `GET /api/v1/rag/documents`: List indexed enterprise documents.

## Admin & Governance
- `GET /api/v1/admin/users`: List users and manage RBAC roles.
- `GET /api/v1/admin/audit-logs`: System audit trail and security activity logs.
- `GET /api/v1/admin/system-health`: CPU, memory, database connection pool, and ML engine latency metrics.
"""

docs_content["ml.md"] = """# OpsIntel Machine Learning Systems

OpsIntel embeds 6 production-grade ML models and statistical inference engines:

## 1. Multi-Horizon Sales Forecasting Engine (`app/ml/sales_forecast.py`)
- **Methodology**: Combines trend-decomposition linear regression with 12-month seasonality index scaling.
- **Horizon**: Configurable from 30 to 180 days with daily or monthly resolution.
- **Confidence Intervals**: 95% parametric confidence bands calculated from historical variance:
  $$\\hat{y}_t \\pm 1.96 \\cdot \\sigma_{residuals} \\cdot \\sqrt{1 + \\frac{t}{N}}$$
- **Outputs**: Baseline forecast, lower bound, upper bound, historical baseline, and trend velocity.

## 2. Customer Churn Prediction Engine (`app/ml/churn_prediction.py`)
- **Features**: Recency (days since last order), Frequency (order count), Monetary Value (LTV, AOV), Days as Customer.
- **Algorithm**: Logistic Regression / Gradient Boosting with MinMax feature scaling.
- **Explainability**: Calculates SHAP-like feature influence contributions (e.g., *Low recency contributed +42% to churn risk*).
- **Risk Categorization**: `LOW` (<0.35), `MEDIUM` (0.35-0.70), `HIGH` (>0.70).

## 3. Inventory Stockout & Replenishment (`app/ml/stockout_prediction.py`)
- **Methodology**: Poisson/Normal distribution demand velocity modeling combined with Wilson Economic Order Quantity (EOQ):
  $$EOQ = \\sqrt{\\frac{2 \\cdot D \\cdot S}{H}}$$
- **Lead-Time Buffer**: Safety stock calculated as:
  $$SS = Z_{\\alpha} \\cdot \\sqrt{L \\cdot \\sigma_D^2 + D^2 \\cdot \\sigma_L^2}$$
- **Outputs**: Days until stockout, stockout probability at current lead-time, and suggested reorder batch size.

## 4. Target Attainment Monte Carlo Simulator (`app/ml/target_achievement.py`)
- **Iterations**: 1,000 independent path simulations.
- **Inputs**: Historical monthly variance, pipeline deal stage probabilities, rep tenure coefficient.
- **Outputs**: Attainment probability percentile ($P_{50}, P_{80}, P_{95}$), shortfall risk distribution, and confidence bounds.

## 5. Statistical & Unsupervised Anomaly Detection (`app/ml/anomaly_detection.py`)
- **Approach**: Hybrid multivariable Z-Score ($|Z| > 2.5$) and Isolation Forest contamination filter.
- **Monitored Streams**: Revenue spikes/drops, abnormal gross margin variances, sudden customer order pauses.

## 6. RFM Customer Segmentation Engine (`app/ml/customer_segmentation.py`)
- **Features**: Recency, Frequency, Monetary value normalized via standard scaling.
- **Algorithm**: K-Means clustering ($K=4$) mapped to interpretable personas:
  1. *High Value Champions*
  2. *Loyal Regulars*
  3. *Growth Potential*
  4. *At Risk / Inactive*
"""

docs_content["ai.md"] = """# OpsIntel Business AI Copilot

The OpsIntel AI Copilot provides conversational operational intelligence with real database query synthesis and deterministic verification.

## Architecture

```mermaid
sequenceDiagram
    User->>Copilot: "What were our top 3 performing regions in Q3 and why?"
    Copilot->>IntentParser: Classify intent & extract temporal filters
    Copilot->>Database: Execute parameterized analytic query
    Copilot->>RAG: Retrieve relevant strategic initiatives & quarterly memos
    Copilot->>SynthesisEngine: Combine structured metrics + document context
    Copilot-->>User: Structured response with tables, insights & document citations
```

## Supported Reasoning Capabilities
1. **Financial Performance Summaries**: Inquiring about MRR, ARR, CAC, gross margin, regional variances.
2. **Predictive Interrogation**: Querying forecast trends, high-risk churn accounts, and upcoming inventory deficits.
3. **Root-Cause Analysis**: Cross-referencing operational dips with supply chain delivery delays and regional sales attrition.
4. **Actionable Recommendations**: Automatic generation of remediation playbooks based on indexed SOPs.
"""

docs_content["rag.md"] = """# Retrieval-Augmented Generation (RAG) Architecture

OpsIntel includes an embedded vector knowledge base designed for operational zero-dependency environments.

## Pipeline Components

1. **Document Ingestion & Chunking (`app/rag/document_chunker.py`)**
   - Supports Markdown, PDF, Plain Text, and JSON SOP documents.
   - Sliding window chunking with configurable chunk size (500 tokens) and overlap (50 tokens) to preserve semantic boundaries.

2. **Vector Store & Cosine Similarity (`app/rag/vector_store.py`)**
   - Pure Python / NumPy TF-IDF and dense embedding vector space.
   - Computes cosine similarity:
     $$\\text{similarity}(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}$$
   - Top-$K$ ranked retrieval with citation metadata preservation (Document ID, Title, Paragraph Offset, Relevance Score).

3. **Context Injection (`app/rag/rag_service.py`)**
   - Formats retrieved excerpts into augmented prompts for the AI Reasoning Engine.
"""

docs_content["security.md"] = """# OpsIntel Security & Role-Based Access Control (RBAC)

OpsIntel implements defense-in-depth enterprise security practices:

## 1. Authentication & Token Lifecycle
- **Password Hashing**: Bcrypt with salted rounds.
- **Token Format**: JWT HMAC-SHA256 bearer tokens with configurable expiration (default: 8 hours).
- **Session Revocation**: Stateless token validation with database verification on user activity status.

## 2. Granular Role Hierarchy
| Role | Permissions |
| :--- | :--- |
| `ADMIN` | Full access: User management, model retraining, system diagnostics, raw audit logs, configuration. |
| `MANAGER` | Department analytics, regional target allocation, inventory reorder approvals, report exports. |
| `ANALYST` | Read-only analytics, forecasting models, RAG document search, custom query generation. |
| `SALES_EXECUTIVE` | Own customer accounts, order creation, individual target attainment tracking. |

## 3. Compliance & Audit Logging
- Every administrative change (user creation, role change, seed reset) is immutably logged to `audit_logs`.
- All database queries are parameterized via SQLAlchemy ORM to eliminate SQL injection vulnerabilities.
- Strict CORS whitelist configuration prevents unauthorized cross-origin requests.
"""

docs_content["development.md"] = """# OpsIntel Local Development & Deployment Guide

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
source venv/bin/activate  # On Windows: .\venv\Scripts\Activate

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
"""

for fname, content in docs_content.items():
    with open(DOCS / fname, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Generated docs/{fname}")
