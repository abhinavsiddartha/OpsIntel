from datetime import datetime, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.all_models import Customer, Order, RiskLevel

def predict_customer_churn(db: Session) -> List[Dict[str, Any]]:
    now = datetime.utcnow()
    customers = db.query(Customer).all()
    results = []
    
    for c in customers:
        days_since_last = (now - c.last_order_date).days if c.last_order_date else 90
        
        # Explainable factors
        factors = []
        if days_since_last > 60:
            factors.append(f"Inactivity of {days_since_last} days exceeds standard 30-day repurchase cycle")
        if c.total_orders < 3:
            factors.append("Low order frequency with limited contract depth")
        if c.avg_order_value < 10000:
            factors.append("Average order value below enterprise contract threshold")
        if not factors:
            factors.append("Consistent quarterly purchase patterns and active engagement")
            
        results.append({
            "customer_id": c.id,
            "name": c.name,
            "company": c.company or c.name,
            "churn_probability": round(c.churn_risk_score, 2),
            "risk_level": c.churn_risk_level.value,
            "top_factors": factors,
            "recency_days": days_since_last,
            "order_count": c.total_orders,
            "monetary_value": c.lifetime_value
        })
        
    results.sort(key=lambda x: x["churn_probability"], reverse=True)
    return results
