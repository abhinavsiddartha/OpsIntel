from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.inventory_service import get_inventory_items, get_inventory_movements

router = APIRouter()

@router.get("")
def list_inventory(risk: Optional[str] = None, db: Session = Depends(get_db)):
    items = get_inventory_items(db, risk_filter=risk)
    return {"success": True, "data": items}

@router.get("/movements")
def list_movements(db: Session = Depends(get_db)):
    movements = get_inventory_movements(db)
    return {"success": True, "data": movements}
