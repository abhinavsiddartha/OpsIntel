# OpsIntel Security & Role-Based Access Control (RBAC)

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
