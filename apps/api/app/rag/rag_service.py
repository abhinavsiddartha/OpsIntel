from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.all_models import Document, DocumentChunk
from app.rag.vector_store import vector_store
from app.rag.document_chunker import DocumentChunker

def index_all_documents(db: Session):
    chunks = (
        db.query(DocumentChunk, Document)
        .join(Document, DocumentChunk.document_id == Document.id)
        .all()
    )
    chunks_data = [
        {
            "chunk_id": c.id,
            "document_id": doc.id,
            "document_title": doc.title,
            "category": doc.category,
            "content": c.content
        }
        for c, doc in chunks
    ]
    vector_store.documents = []
    vector_store.add_chunks(chunks_data)

def search_rag(db: Session, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
    if not vector_store.documents:
        index_all_documents(db)
    results = vector_store.search(query, top_k=top_k)
    if not results:
        # Fallback to general chunks
        first_chunks = db.query(DocumentChunk, Document).join(Document, DocumentChunk.document_id == Document.id).limit(top_k).all()
        results = [
            {
                "chunk_id": c.id,
                "document_id": doc.id,
                "document_title": doc.title,
                "category": doc.category,
                "content": c.content,
                "similarity_score": 0.65
            }
            for c, doc in first_chunks
        ]
    return results

def get_documents_list(db: Session):
    docs = db.query(Document).all()
    return [
        {
            "id": d.id,
            "title": d.title,
            "filename": d.filename,
            "file_type": d.file_type,
            "file_size": d.file_size,
            "chunk_count": d.chunk_count,
            "category": d.category,
            "created_at": d.created_at.isoformat()
        }
        for d in docs
    ]
