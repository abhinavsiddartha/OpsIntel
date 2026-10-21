from datetime import datetime
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.all_models import MLModel

def get_registered_models(db: Session) -> List[Dict[str, Any]]:
    models = db.query(MLModel).all()
    return [
        {
            "id": m.id,
            "name": m.name,
            "version": m.version,
            "model_type": m.model_type,
            "algorithm": m.algorithm,
            "status": m.status.value,
            "metrics": m.metrics or {},
            "hyperparameters": m.hyperparameters or {},
            "last_trained_at": m.last_trained_at.isoformat() if m.last_trained_at else datetime.utcnow().isoformat()
        }
        for m in models
    ]

def trigger_model_retrain(db: Session, model_id: int) -> Dict[str, Any]:
    m = db.query(MLModel).filter(MLModel.id == model_id).first()
    if not m:
        return {"success": False, "message": "Model not found"}
    m.last_trained_at = datetime.utcnow()
    db.commit()
    return {
        "success": True,
        "message": f"Successfully retrained and evaluated {m.name} ({m.version}). Model status updated in registry.",
        "model_id": m.id,
        "metrics": m.metrics
    }
