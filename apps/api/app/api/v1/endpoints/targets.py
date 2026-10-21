from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.all_schemas import TargetCreate
from app.services.target_service import get_targets, create_target

router = APIRouter()

@router.get("")
def list_targets(db: Session = Depends(get_db)):
    targets = get_targets(db)
    return {"success": True, "data": targets}

@router.post("")
def new_target(target_in: TargetCreate, db: Session = Depends(get_db)):
    t = create_target(db, target_in)
    return {"success": True, "data": {"id": t.id, "title": t.title, "period": t.period}}
