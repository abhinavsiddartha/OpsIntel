from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.all_models import Anomaly

def detect_anomalies(db: Session) -> List[Dict[str, Any]]:
    anomalies = db.query(Anomaly).order_by(desc(Anomaly.anomaly_score)).all()
    return [
        {
            "id": a.id,
            "entity_type": a.entity_type,
            "entity_id": a.entity_id,
            "reference_code": a.reference_code,
            "anomaly_score": round(a.anomaly_score, 2),
            "severity": a.severity.value,
            "reason": a.reason,
            "observed_value": a.observed_value,
            "expected_value": a.expected_value,
            "status": a.status,
            "created_at": a.created_at.isoformat()
        }
        for a in anomalies
    ]
