from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.ml import (
    generate_sales_forecast,
    predict_customer_churn,
    predict_inventory_stockouts,
    predict_target_achievements,
    detect_anomalies,
    get_customer_segments,
    get_registered_models,
    trigger_model_retrain
)

router = APIRouter()

@router.get("/forecast")
def sales_forecast(horizon: int = Query(30, ge=7, le=90), db: Session = Depends(get_db)):
    data = generate_sales_forecast(db, horizon_days=horizon)
    return {"success": True, "data": data}

@router.get("/churn")
def customer_churn(db: Session = Depends(get_db)):
    data = predict_customer_churn(db)
    return {"success": True, "data": data}

@router.get("/stockout")
def inventory_stockout(db: Session = Depends(get_db)):
    data = predict_inventory_stockouts(db)
    return {"success": True, "data": data}

@router.get("/targets")
def target_predictions(db: Session = Depends(get_db)):
    data = predict_target_achievements(db)
    return {"success": True, "data": data}

@router.get("/anomalies")
def anomalies(db: Session = Depends(get_db)):
    data = detect_anomalies(db)
    return {"success": True, "data": data}

@router.get("/segments")
def customer_segments(db: Session = Depends(get_db)):
    data = get_customer_segments(db)
    return {"success": True, "data": data}

@router.get("/models")
def model_registry(db: Session = Depends(get_db)):
    data = get_registered_models(db)
    return {"success": True, "data": data}

@router.post("/models/{model_id}/retrain")
def retrain_model(model_id: int, db: Session = Depends(get_db)):
    result = trigger_model_retrain(db, model_id)
    return result
