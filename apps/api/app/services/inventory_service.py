from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.all_models import Inventory, Product, Category, InventoryMovement

def get_inventory_items(db: Session, risk_filter: str = None):
    query = db.query(Inventory, Product, Category).join(Product, Inventory.product_id == Product.id).join(Category, Product.category_id == Category.id)
    if risk_filter:
        query = query.filter(Inventory.stockout_risk == risk_filter)
    results = query.order_by(Inventory.days_until_stockout.asc()).all()
    items = []
    for inv, prod, cat in results:
        items.append({
            "id": inv.id,
            "product_id": prod.id,
            "sku": prod.sku,
            "product_name": prod.name,
            "category_name": cat.name,
            "current_stock": inv.current_stock,
            "reserved_stock": inv.reserved_stock,
            "available_stock": inv.available_stock,
            "daily_demand_rate": inv.daily_demand_rate,
            "days_until_stockout": inv.days_until_stockout,
            "stockout_risk": inv.stockout_risk.value,
            "recommended_reorder_qty": inv.recommended_reorder_qty,
            "unit_price": prod.unit_price,
            "inventory_value": round(inv.current_stock * prod.unit_price, 2)
        })
    return items

def get_inventory_movements(db: Session, limit: int = 30):
    movements = db.query(InventoryMovement, Product).join(Product, InventoryMovement.product_id == Product.id).order_by(desc(InventoryMovement.created_at)).limit(limit).all()
    return [
        {
            "id": m.id,
            "product_name": p.name,
            "movement_type": m.movement_type.value,
            "quantity": m.quantity,
            "reason": m.reason,
            "created_at": m.created_at.isoformat()
        }
        for m, p in movements
    ]
