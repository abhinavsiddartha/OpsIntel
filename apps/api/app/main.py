from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import SessionLocal, Base, engine
from app.services.seed_service import seed_database
from app.api.v1.api import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB & Seed data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db, force_reset=False)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Set CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "status": "online",
        "docs": f"{settings.API_V1_STR}/docs",
        "api_version": "v1"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
