from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.all_models import AIConversation, AIMessage
from app.ai.business_reasoning import generate_grounded_response

def chat_with_copilot(db: Session, message: str, conversation_id: int = None, user_id: int = None) -> Dict[str, Any]:
    if not conversation_id:
        convo = AIConversation(
            title=message[:50] + ("..." if len(message) > 50 else ""),
            user_id=user_id,
            created_at=datetime.utcnow()
        )
        db.add(convo)
        db.commit()
        db.refresh(convo)
        conversation_id = convo.id
        
    # Save user message
    user_msg = AIMessage(
        conversation_id=conversation_id,
        role="user",
        content=message,
        created_at=datetime.utcnow()
    )
    db.add(user_msg)
    db.commit()
    
    # Generate business-grounded response
    grounded = generate_grounded_response(db, message)
    
    # Save assistant message
    ai_msg = AIMessage(
        conversation_id=conversation_id,
        role="assistant",
        content=grounded["message"],
        metrics_data=grounded.get("metrics"),
        recommendations=grounded.get("recommendations"),
        citations=grounded.get("citations"),
        created_at=datetime.utcnow()
    )
    db.add(ai_msg)
    db.commit()
    
    return {
        "conversation_id": conversation_id,
        "message": grounded["message"],
        "reasoning": grounded["reasoning"],
        "metrics": grounded.get("metrics", []),
        "recommendations": grounded.get("recommendations", []),
        "citations": grounded.get("citations", [])
    }

def get_conversations(db: Session, user_id: int = None):
    query = db.query(AIConversation)
    if user_id:
        query = query.filter(AIConversation.user_id == user_id)
    convos = query.order_by(AIConversation.updated_at.desc()).all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "created_at": c.created_at.isoformat(),
            "message_count": len(c.messages)
        }
        for c in convos
    ]

def get_conversation_messages(db: Session, conversation_id: int):
    msgs = db.query(AIMessage).filter(AIMessage.conversation_id == conversation_id).order_by(AIMessage.created_at.asc()).all()
    return [
        {
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "metrics": m.metrics_data,
            "recommendations": m.recommendations,
            "citations": m.citations,
            "created_at": m.created_at.isoformat()
        }
        for m in msgs
    ]
