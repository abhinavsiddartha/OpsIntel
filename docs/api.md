# OpsIntel REST API Reference (`/api/v1`)

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
