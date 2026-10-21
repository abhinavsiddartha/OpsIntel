from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.employee_service import get_employees

router = APIRouter()

@router.get("")
def list_employees(db: Session = Depends(get_db)):
    emps = get_employees(db)
    return {"success": True, "data": emps}
