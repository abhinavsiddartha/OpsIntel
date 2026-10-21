from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.sales_service import get_orders

router = APIRouter()

@router.get("/orders")
def list_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    region_id: Optional[int] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    result = get_orders(db, page, page_size, region_id, status, search)
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
