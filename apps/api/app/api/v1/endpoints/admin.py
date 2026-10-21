from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.admin_service import get_notifications, mark_notification_read, get_audit_logs, get_system_health
from app.services.seed_service import seed_database
from app.models.all_models import User, UserRole

router = APIRouter()

@router.get("/notifications")
def notifications(db: Session = Depends(get_db)):
    data = get_notifications(db)
    return {"success": True, "data": data}

@router.post("/notifications/{notif_id}/read")
def read_notification(notif_id: int, db: Session = Depends(get_db)):
    mark_notification_read(db, notif_id)
    return {"success": True}

@router.get("/audit-logs")
def audit_logs(db: Session = Depends(get_db)):
    logs = get_audit_logs(db)
    return {"success": True, "data": logs}

@router.get("/health")
def system_health(db: Session = Depends(get_db)):
    health = get_system_health(db)
    return {"success": True, "data": health}

@router.get("/users")
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return {
        "success": True,
        "data": [
            {
                "id": u.id,
                "email": u.email,
                "full_name": u.full_name,
                "role": u.role.value,
                "is_active": u.is_active,
                "created_at": u.created_at.isoformat()
            }
            for u in users
        ]
    }

@router.post("/seed-reset")
def reset_seed(db: Session = Depends(get_db)):
    res = seed_database(db, force_reset=True)
    return {"success": True, "data": res}
