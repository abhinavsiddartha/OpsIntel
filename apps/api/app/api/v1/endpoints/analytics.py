from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.analytics_service import get_overview_analytics

router = APIRouter()

@router.get("/overview")
def overview(db: Session = Depends(get_db)):
    data = get_overview_analytics(db)
    return {"success": True, "data": data}
