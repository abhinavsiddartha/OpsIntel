from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.all_models import Customer, Order

def get_customers(db: Session, page: int = 1, page_size: int = 20, segment: Optional[str] = None, risk: Optional[str] = None, search: Optional[str] = None):
    query = db.query(Customer)
    if segment:
        query = query.filter(Customer.segment_name == segment)
    if risk:
        query = query.filter(Customer.churn_risk_level == risk)
    if search:
        query = query.filter((Customer.name.ilike(f"%{search}%")) | (Customer.customer_code.ilike(f"%{search}%")) | (Customer.email.ilike(f"%{search}%")))
    total = query.count()
    custs = query.order_by(desc(Customer.lifetime_value)).offset((page - 1) * page_size).limit(page_size).all()
    items = []
    for c in custs:
        items.append({
            "id": c.id,
            "customer_code": c.customer_code,
            "name": c.name,
            "company": c.company,
            "email": c.email,
            "region_name": c.region.name if c.region else "Global",
            "lifetime_value": c.lifetime_value,
            "total_orders": c.total_orders,
            "avg_order_value": c.avg_order_value,
            "last_order_date": c.last_order_date.isoformat() if c.last_order_date else None,
            "churn_risk_score": c.churn_risk_score,
            "churn_risk_level": c.churn_risk_level.value,
            "segment_name": c.segment_name
        })
    return {"items": items, "total": total, "page": page, "pageSize": page_size, "totalPages": (total + page_size - 1) // page_size}

def get_customer_detail(db: Session, customer_id: int):
    cust = db.query(Customer).filter(Customer.id == customer_id).first()
    if not cust:
        return None
    orders = db.query(Order).filter(Order.customer_id == customer_id).order_by(desc(Order.order_date)).all()
    timeline = [
        {"date": o.order_date.isoformat(), "type": "order", "description": f"Placed Order {o.order_number} ({len(o.items)} items)", "amount": o.total_amount}
        for o in orders
    ]
    return {
        "id": cust.id,
        "customer_code": cust.customer_code,
        "name": cust.name,
        "company": cust.company,
        "email": cust.email,
        "region_name": cust.region.name if cust.region else "Global",
        "lifetime_value": cust.lifetime_value,
        "total_orders": cust.total_orders,
        "avg_order_value": cust.avg_order_value,
        "last_order_date": cust.last_order_date.isoformat() if cust.last_order_date else None,
        "churn_risk_score": cust.churn_risk_score,
        "churn_risk_level": cust.churn_risk_level.value,
        "segment_name": cust.segment_name,
        "timeline": timeline
    }
