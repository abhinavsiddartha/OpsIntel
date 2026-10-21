from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.all_models import Order, Customer, Region

def get_orders(db: Session, page: int = 1, page_size: int = 20, region_id: Optional[int] = None, status: Optional[str] = None, search: Optional[str] = None):
    query = db.query(Order)
    if region_id:
        query = query.filter(Order.region_id == region_id)
    if status:
        query = query.filter(Order.status == status)
    if search:
        query = query.join(Customer).filter((Order.order_number.ilike(f"%{search}%")) | (Customer.name.ilike(f"%{search}%")))
    total = query.count()
    orders = query.order_by(desc(Order.order_date)).offset((page - 1) * page_size).limit(page_size).all()
    items = []
    for o in orders:
        items.append({
            "id": o.id,
            "order_number": o.order_number,
            "customer_id": o.customer_id,
            "customer_name": o.customer.name if o.customer else "Unknown",
            "region_name": o.region.name if o.region else "Global",
            "salesperson_name": o.employee.name if o.employee else "Unassigned",
            "total_amount": o.total_amount,
            "discount_amount": o.discount_amount,
            "status": o.status.value,
            "order_date": o.order_date.isoformat(),
            "items": [
                {"id": it.id, "product_id": it.product_id, "product_name": it.product.name if it.product else "Product", "quantity": it.quantity, "unit_price": it.unit_price, "total_price": it.total_price}
                for it in o.items
            ]
        })
    return {"items": items, "total": total, "page": page, "pageSize": page_size, "totalPages": (total + page_size - 1) // page_size}
