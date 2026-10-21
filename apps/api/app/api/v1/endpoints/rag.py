from fastapi import APIRouter, Depends, Query, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.all_schemas import RAGSearchRequest
from app.rag import search_rag, get_documents_list
from app.models.all_models import Document, DocumentChunk
from app.rag.document_chunker import DocumentChunker

router = APIRouter()

@router.get("/documents")
def list_documents(db: Session = Depends(get_db)):
    docs = get_documents_list(db)
    return {"success": True, "data": docs}

@router.post("/search")
def search(request: RAGSearchRequest, db: Session = Depends(get_db)):
    results = search_rag(db, query=request.query, top_k=request.top_k)
    return {"success": True, "data": results}

@router.post("/upload")
async def upload_document(file: UploadFile = File(...), category: str = "Operations", db: Session = Depends(get_db)):
    content_bytes = await file.read()
    content_str = content_bytes.decode("utf-8", errors="ignore")
    
    doc = Document(
        title=file.filename.replace(".txt", "").replace("_", " ").title(),
        filename=file.filename,
        file_type=file.filename.split(".")[-1] if "." in file.filename else "txt",
        file_size=len(content_bytes),
        category=category,
        chunk_count=0
    )
    db.add(doc)
    db.flush()
    
    chunks = DocumentChunker.chunk_text(content_str)
    doc.chunk_count = len(chunks)
    for idx, c_text in enumerate(chunks):
        chunk = DocumentChunk(
            document_id=doc.id,
            chunk_index=idx,
            content=c_text,
            metadata_info={"source": doc.filename, "category": category}
        )
        db.add(chunk)
    db.commit()
    
    return {
        "success": True,
        "data": {
            "id": doc.id,
            "title": doc.title,
            "filename": doc.filename,
            "chunk_count": doc.chunk_count
        }
    }
