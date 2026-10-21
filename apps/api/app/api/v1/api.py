from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, analytics, sales, customers, inventory,
    employees, targets, ml, ai, rag, admin, health
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(sales.router, prefix="/sales", tags=["Sales"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customers"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
api_router.include_router(employees.router, prefix="/employees", tags=["Employees"])
api_router.include_router(targets.router, prefix="/targets", tags=["Targets"])
api_router.include_router(ml.router, prefix="/ml", tags=["ML Intelligence"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Copilot"])
api_router.include_router(rag.router, prefix="/rag", tags=["RAG Knowledge Base"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin & System"])
api_router.include_router(health.router, tags=["Health"])
