from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.all_schemas import AIChatRequest
from app.ai import chat_with_copilot, get_conversations, get_conversation_messages
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/chat")
def chat(request: AIChatRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_id = current_user.id if current_user else None
    result = chat_with_copilot(db, message=request.message, conversation_id=request.conversation_id, user_id=user_id)
    return {"success": True, "data": result}

@router.get("/conversations")
def conversations(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_id = current_user.id if current_user else None
    convos = get_conversations(db, user_id=user_id)
    return {"success": True, "data": convos}

@router.get("/conversations/{conversation_id}/messages")
def messages(conversation_id: int, db: Session = Depends(get_db)):
    msgs = get_conversation_messages(db, conversation_id=conversation_id)
    return {"success": True, "data": msgs}
