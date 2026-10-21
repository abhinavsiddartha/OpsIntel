from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token
from app.schemas.all_schemas import UserLogin, UserRegister, APIResponse
from app.services.auth_service import authenticate_user, register_user
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    token = create_access_token(user.id)
    return {
        "success": True,
        "data": {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role.value,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat()
            }
        }
    }

@router.post("/register")
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    user = register_user(db, user_in)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    token = create_access_token(user.id)
    return {
        "success": True,
        "data": {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role.value,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat()
            }
        }
    }

@router.get("/me")
def get_current_profile(current_user = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return {
        "success": True,
        "data": {
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "role": current_user.role.value,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at.isoformat()
        }
    }
