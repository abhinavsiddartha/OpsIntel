from sqlalchemy.orm import Session
from app.models.all_models import User
from app.schemas.all_schemas import UserLogin, UserRegister
from app.core.security import verify_password, get_password_hash

def authenticate_user(db: Session, credentials: UserLogin):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password) or not user.is_active:
        return None
    return user

def register_user(db: Session, user_in: UserRegister):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        return None
    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        role=user_in.role,
        hashed_password=get_password_hash(user_in.password),
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
