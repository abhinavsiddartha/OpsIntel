from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.all_models import Employee

def get_employees(db: Session):
    emps = db.query(Employee).order_by(desc(Employee.current_revenue)).all()
    return [
        {
            "id": e.id,
            "name": e.name,
            "email": e.email,
            "role_title": e.role_title,
            "region_name": e.region.name if e.region else "Global",
            "monthly_target": e.monthly_target,
            "current_revenue": e.current_revenue,
            "achievement_rate": round((e.current_revenue / max(e.monthly_target, 1)) * 100, 1),
            "performance_score": e.performance_score,
            "predicted_target_probability": round(min(100.0, (e.current_revenue / max(e.monthly_target, 1)) * 95.0 + 8.0), 1),
            "is_active": e.is_active
        }
        for e in emps
    ]
