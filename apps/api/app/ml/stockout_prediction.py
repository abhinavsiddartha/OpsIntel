from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.all_models import Inventory, Product, RiskLevel

def predict_inventory_stockouts(db: Session) -> List[Dict[str, Any]]:
    items = (
        db.query(Inventory, Product)
        .join(Product, Inventory.product_id == Product.id)
        .order_by(Inventory.days_until_stockout.asc())
        .all()
    )
    results = []
    for inv, p in items:
        # Stockout probability calculation based on lead time vs days left
        if inv.days_until_stockout >= 900:
            prob = 0.01
        elif inv.days_until_stockout <= p.lead_time_days:
            prob = 0.95
        elif inv.days_until_stockout <= (p.lead_time_days + 5):
            prob = 0.72
        elif inv.days_until_stockout <= (p.lead_time_days + 15):
            prob = 0.38
        else:
            prob = 0.08
            
        results.append({
            "product_id": p.id,
            "product_name": p.name,
            "sku": p.sku,
            "current_stock": inv.current_stock,
            "daily_demand_rate": inv.daily_demand_rate,
            "days_remaining": inv.days_until_stockout,
            "stockout_probability": round(prob, 2),
            "risk_level": inv.stockout_risk.value,
            "recommended_reorder": inv.recommended_reorder_qty,
            "lead_time_days": p.lead_time_days
        })
    return results
