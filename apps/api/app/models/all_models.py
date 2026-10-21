from datetime import datetime
import enum
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime,
    ForeignKey, Text, Enum as SQLEnum, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    ANALYST = "analyst"
    SALES_EXECUTIVE = "sales_executive"

class OrderStatus(str, enum.Enum):
    COMPLETED = "completed"
    PROCESSING = "processing"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class RiskLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class MovementType(str, enum.Enum):
    INBOUND = "inbound"
    OUTBOUND = "outbound"
    ADJUSTMENT = "adjustment"
    RETURN = "return"

class ModelStatus(str, enum.Enum):
    PRODUCTION = "production"
    STAGING = "staging"
    ARCHIVED = "archived"

class NotificationSeverity(str, enum.Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    CRITICAL = "critical"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.ANALYST, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Region(Base):
    __tablename__ = "regions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(10), unique=True, nullable=False)
    manager_name = Column(String(255))
    target_revenue = Column(Float, default=0.0)

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    role_title = Column(String(100), default="Account Executive")
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=True)
    monthly_target = Column(Float, default=50000.0)
    current_revenue = Column(Float, default=0.0)
    performance_score = Column(Float, default=85.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    region = relationship("Region")

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    unit_price = Column(Float, nullable=False)
    cost_price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, default=0)
    reorder_point = Column(Integer, default=20)
    safety_stock = Column(Integer, default=10)
    lead_time_days = Column(Integer, default=7)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    category = relationship("Category")
    inventory_items = relationship("Inventory", back_populates="product")

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    company = Column(String(255))
    email = Column(String(255), unique=True, index=True, nullable=False)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=True)
    lifetime_value = Column(Float, default=0.0)
    total_orders = Column(Integer, default=0)
    avg_order_value = Column(Float, default=0.0)
    last_order_date = Column(DateTime)
    churn_risk_score = Column(Float, default=0.0)
    churn_risk_level = Column(SQLEnum(RiskLevel), default=RiskLevel.LOW)
    segment_name = Column(String(100), default="Regular")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    region = relationship("Region")
    orders = relationship("Order", back_populates="customer")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=True)
    total_amount = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.COMPLETED)
    order_date = Column(DateTime, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    customer = relationship("Customer", back_populates="orders")
    employee = relationship("Employee")
    region = relationship("Region")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")

class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), unique=True, nullable=False)
    current_stock = Column(Integer, default=0)
    reserved_stock = Column(Integer, default=0)
    available_stock = Column(Integer, default=0)
    daily_demand_rate = Column(Float, default=0.0)
    days_until_stockout = Column(Float, default=999.0)
    stockout_risk = Column(SQLEnum(RiskLevel), default=RiskLevel.LOW)
    recommended_reorder_qty = Column(Integer, default=0)
    last_restocked_at = Column(DateTime)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    product = relationship("Product", back_populates="inventory_items")

class InventoryMovement(Base):
    __tablename__ = "inventory_movements"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    movement_type = Column(SQLEnum(MovementType), nullable=False)
    quantity = Column(Integer, nullable=False)
    reason = Column(String(255))
    reference_id = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    product = relationship("Product")

class Target(Base):
    __tablename__ = "targets"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    period = Column(String(50), nullable=False)  # "2026-Q1", "2026-03"
    entity_type = Column(String(50), nullable=False)  # "company", "region", "employee", "category"
    entity_id = Column(Integer, nullable=True)
    target_value = Column(Float, nullable=False)
    actual_value = Column(Float, default=0.0)
    achievement_rate = Column(Float, default=0.0)
    predicted_achievement = Column(Float, default=0.0)
    risk_level = Column(SQLEnum(RiskLevel), default=RiskLevel.LOW)
    created_at = Column(DateTime, default=datetime.utcnow)

class MLModel(Base):
    __tablename__ = "ml_models"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    version = Column(String(50), nullable=False)
    model_type = Column(String(50), nullable=False)
    algorithm = Column(String(100), nullable=False)
    status = Column(SQLEnum(ModelStatus), default=ModelStatus.PRODUCTION)
    metrics = Column(JSON, default=dict)
    hyperparameters = Column(JSON, default=dict)
    last_trained_at = Column(DateTime, default=datetime.utcnow)

class Anomaly(Base):
    __tablename__ = "anomalies"
    
    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False)  # "order", "inventory", "customer", "discount"
    entity_id = Column(Integer, nullable=False)
    reference_code = Column(String(100))
    anomaly_score = Column(Float, nullable=False)
    severity = Column(SQLEnum(RiskLevel), default=RiskLevel.MEDIUM)
    reason = Column(Text, nullable=False)
    observed_value = Column(Float)
    expected_value = Column(Float)
    status = Column(String(50), default="detected")  # "detected", "reviewed", "resolved"
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(SQLEnum(NotificationSeverity), default=NotificationSeverity.INFO)
    category = Column(String(50), default="system")  # "anomaly", "stockout", "churn", "target", "system"
    link = Column(String(255))
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(255), nullable=False)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(100))
    details = Column(Text)
    ip_address = Column(String(50), default="127.0.0.1")
    created_at = Column(DateTime, default=datetime.utcnow)

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), default="txt")
    file_size = Column(Integer, default=0)
    chunk_count = Column(Integer, default=0)
    category = Column(String(100), default="General")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    metadata_info = Column(JSON, default=dict)
    
    document = relationship("Document", back_populates="chunks")

class AIConversation(Base):
    __tablename__ = "ai_conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), default="New Business Inquiry")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    messages = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan")

class AIMessage(Base):
    __tablename__ = "ai_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("ai_conversations.id"), nullable=False)
    role = Column(String(50), nullable=False)  # "user", "assistant", "system"
    content = Column(Text, nullable=False)
    metrics_data = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)
    citations = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    conversation = relationship("AIConversation", back_populates="messages")
