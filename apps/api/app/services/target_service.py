from sqlalchemy.orm import Session
from app.models.all_models import Target, RiskLevel
from app.schemas.all_schemas import TargetCreate

def get_targets(db: Session):
    targets = db.query(Target).all()
    return [
        {
            "id": t.id,
            "title": t.title,
            "period": t.period,
            "entity_type": t.entity_type,
            "entity_id": t.entity_id,
            "target_value": t.target_value,
            "actual_value": t.actual_value,
            "achievement_rate": t.achievement_rate,
            "predicted_achievement": t.predicted_achievement,
            "risk_level": t.risk_level.value,
            "created_at": t.created_at.isoformat()
        }
        for t in targets
    ]

def create_target(db: Session, target_in: TargetCreate):
    t = Target(
        title=target_in.title,
        period=target_in.period,
        entity_type=target_in.entity_type,
        entity_id=target_in.entity_id,
        target_value=target_in.target_value,
        actual_value=0.0,
        achievement_rate=0.0,
        predicted_achievement=85.0,
        risk_level=RiskLevel.MEDIUM
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return t
