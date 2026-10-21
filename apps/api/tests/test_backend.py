import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal, Base, engine
from app.services.seed_service import seed_database

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    db = SessionLocal()
    seed_database(db, force_reset=True)
    db.close()
    yield

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_auth_login_admin():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@opsintel.com", "password": "AdminPassword123!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert data["data"]["user"]["role"] == "admin"

def test_overview_analytics():
    response = client.get("/api/v1/analytics/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "revenue" in data["data"]["kpis"]
    assert len(data["data"]["sales_by_region"]) == 4

def test_sales_orders_list():
    response = client.get("/api/v1/sales/orders?page=1&page_size=10")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) <= 10
    assert data["meta"]["total"] > 0

def test_ml_sales_forecast():
    response = client.get("/api/v1/ml/forecast?horizon=30")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["horizon_days"] == 30
    assert len(data["data"]["series"]) > 30

def test_ml_churn_prediction():
    response = client.get("/api/v1/ml/churn")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) > 0
    assert "churn_probability" in data["data"][0]

def test_ml_stockout_prediction():
    response = client.get("/api/v1/ml/stockout")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) > 0

def test_ai_copilot_chat():
    response = client.post(
        "/api/v1/ai/chat",
        json={"message": "What are the biggest operational risks currently impacting revenue?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "message" in data["data"]
    assert len(data["data"]["recommendations"]) > 0

def test_rag_search():
    response = client.post(
        "/api/v1/rag/search",
        json={"query": "inventory safety stock formula", "top_k": 3}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) > 0

def test_admin_system_health():
    response = client.get("/api/v1/admin/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "operational"
