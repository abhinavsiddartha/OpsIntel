from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.customer_service import get_customers, get_customer_detail

router = APIRouter()

@router.get("")
def list_customers(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    segment: Optional[str] = None,
    risk: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    result = get_customers(db, page, page_size, segment, risk, search)
    return {
        "success": True,
        "data": result["items"],
        "meta": {
            "page": result["page"],
            "pageSize": result["pageSize"],
            "total": result["total"],
            "totalPages": result["totalPages"]
        }
    }

@router.get("/{customer_id}")
def customer_detail(customer_id: int, db: Session = Depends(get_db)):
    cust = get_customer_detail(db, customer_id)
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"success": True, "data": cust}
