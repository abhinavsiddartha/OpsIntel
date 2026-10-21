from datetime import datetime
from typing import List, Optional, Any, Dict, Generic, TypeVar
from pydantic import BaseModel, Field
from app.models.all_models import UserRole, OrderStatus, RiskLevel, MovementType, ModelStatus, NotificationSeverity

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    meta: Optional[Dict[str, Any]] = None
    error: Optional[Dict[str, Any]] = None

class PaginatedMeta(BaseModel):
    page: int
    pageSize: int
    total: int
    totalPages: int

# Auth Schemas
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    role: UserRole = UserRole.ANALYST

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# Analytics & Overview Schemas
class KpiCardData(BaseModel):
    title: str
    value: str
    numeric_value: float
    previous_value: float
    change_pct: float
    trend: str  # "up", "down", "neutral"
    unit: str
    sparkline: List[float] = []

class OverviewAnalyticsOut(BaseModel):
    kpis: Dict[str, KpiCardData]
    revenue_trend: List[Dict[str, Any]]
    sales_by_region: List[Dict[str, Any]]
    top_products: List[Dict[str, Any]]
    target_achievement: List[Dict[str, Any]]
    stockout_risks: List[Dict[str, Any]]
    churn_risks: List[Dict[str, Any]]
    ai_summary: str

# Sales & Orders Schemas
class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: float
    total_price: float

class OrderOut(BaseModel):
    id: int
    order_number: str
    customer_id: int
    customer_name: str
    region_name: str
    salesperson_name: str
    total_amount: float
    discount_amount: float
    status: OrderStatus
    order_date: datetime
    items: List[OrderItemOut] = []

# Customer Schemas
class CustomerOut(BaseModel):
    id: int
    customer_code: str
    name: str
    company: Optional[str]
    email: str
    region_name: str
    lifetime_value: float
    total_orders: int
    avg_order_value: float
    last_order_date: Optional[datetime]
    churn_risk_score: float
    churn_risk_level: RiskLevel
    segment_name: str

class CustomerTimelineEvent(BaseModel):
    date: datetime
    type: str
    description: str
    amount: Optional[float] = None

# Inventory Schemas
class InventoryOut(BaseModel):
    id: int
    product_id: int
    sku: str
    product_name: str
    category_name: str
    current_stock: int
    reserved_stock: int
    available_stock: int
    daily_demand_rate: float
    days_until_stockout: float
    stockout_risk: RiskLevel
    recommended_reorder_qty: int
    unit_price: float
    inventory_value: float

class InventoryMovementOut(BaseModel):
    id: int
    product_name: str
    movement_type: MovementType
    quantity: int
    reason: Optional[str]
    created_at: datetime

# Employee Schemas
class EmployeeOut(BaseModel):
    id: int
    name: str
    email: str
    role_title: str
    region_name: str
    monthly_target: float
    current_revenue: float
    achievement_rate: float
    performance_score: float
    predicted_target_probability: float
    is_active: bool

# Target Schemas
class TargetCreate(BaseModel):
    title: str
    period: str
    entity_type: str
    entity_id: Optional[int] = None
    target_value: float

class TargetOut(BaseModel):
    id: int
    title: str
    period: str
    entity_type: str
    entity_id: Optional[int]
    target_value: float
    actual_value: float
    achievement_rate: float
    predicted_achievement: float
    risk_level: RiskLevel
    created_at: datetime

# ML Schemas
class ForecastDataPoint(BaseModel):
    date: str
    predicted_sales: float
    lower_bound: float
    upper_bound: float
    is_historical: bool = False

class ForecastResultOut(BaseModel):
    horizon_days: int
    model_name: str
    metrics: Dict[str, float]  # MAE, RMSE, MAPE
    series: List[ForecastDataPoint]
    total_predicted_revenue: float
    growth_rate: float

class ChurnCustomerOut(BaseModel):
    customer_id: int
    name: str
    company: Optional[str]
    churn_probability: float
    risk_level: RiskLevel
    top_factors: List[str]
    recency_days: int
    order_count: int
    monetary_value: float

class StockoutPredictionOut(BaseModel):
    product_id: int
    product_name: str
    sku: str
    current_stock: int
    daily_demand_rate: float
    days_remaining: float
    stockout_probability: float
    risk_level: RiskLevel
    recommended_reorder: int
    lead_time_days: int

class TargetPredictionOut(BaseModel):
    target_id: int
    title: str
    period: str
    current_achievement: float
    predicted_final_achievement: float
    probability_of_success: float
    risk_level: RiskLevel

class AnomalyOut(BaseModel):
    id: int
    entity_type: str
    entity_id: int
    reference_code: Optional[str]
    anomaly_score: float
    severity: RiskLevel
    reason: str
    observed_value: Optional[float]
    expected_value: Optional[float]
    status: str
    created_at: datetime

class SegmentClusterOut(BaseModel):
    segment_name: str
    customer_count: int
    avg_ltv: float
    avg_orders: int
    avg_recency_days: float
    description: str
    persona: str
    color: str

class MLModelOut(BaseModel):
    id: int
    name: str
    version: str
    model_type: str
    algorithm: str
    status: ModelStatus
    metrics: Dict[str, Any]
    hyperparameters: Dict[str, Any]
    last_trained_at: datetime

# AI Copilot Schemas
class AIChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

class AIStructuredBlock(BaseModel):
    type: str  # "metric", "chart", "alert", "recommendation", "citation"
    title: Optional[str] = None
    data: Any

class AIChatResponse(BaseModel):
    conversation_id: int
    message: str
    reasoning: str
    metrics: Optional[List[Dict[str, Any]]] = None
    recommendations: Optional[List[str]] = None
    citations: Optional[List[Dict[str, Any]]] = None
    structured_blocks: Optional[List[AIStructuredBlock]] = None

class AIConversationOut(BaseModel):
    id: int
    title: str
    created_at: datetime
    message_count: int

# RAG Schemas
class DocumentOut(BaseModel):
    id: int
    title: str
    filename: str
    file_type: str
    file_size: int
    chunk_count: int
    category: str
    created_at: datetime

class RAGSearchRequest(BaseModel):
    query: str
    top_k: int = 4

class RAGSearchResult(BaseModel):
    chunk_id: int
    document_id: int
    document_title: str
    category: str
    content: str
    similarity_score: float

# Reports & Notifications & Admin Schemas
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    severity: NotificationSeverity
    category: str
    link: Optional[str]
    is_read: bool
    created_at: datetime

class AuditLogOut(BaseModel):
    id: int
    user_email: str
    action: str
    entity_type: str
    entity_id: Optional[str]
    details: Optional[str]
    ip_address: str
    created_at: datetime

class SystemHealthComponent(BaseModel):
    name: str
    status: str  # "operational", "degraded", "down"
    latency_ms: float
    details: str

class SystemHealthOut(BaseModel):
    status: str
    uptime_seconds: float
    components: List[SystemHealthComponent]
    database_stats: Dict[str, Any]
