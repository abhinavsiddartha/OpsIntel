from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def ping():
    return {"status": "ok", "service": "OpsIntel REST API Engine", "version": "1.0.0"}
