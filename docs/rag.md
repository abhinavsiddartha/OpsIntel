# Retrieval-Augmented Generation (RAG) Architecture

OpsIntel includes an embedded vector knowledge base designed for operational zero-dependency environments.

## Pipeline Components

1. **Document Ingestion & Chunking (`app/rag/document_chunker.py`)**
   - Supports Markdown, PDF, Plain Text, and JSON SOP documents.
   - Sliding window chunking with configurable chunk size (500 tokens) and overlap (50 tokens) to preserve semantic boundaries.

2. **Vector Store & Cosine Similarity (`app/rag/vector_store.py`)**
   - Pure Python / NumPy TF-IDF and dense embedding vector space.
   - Computes cosine similarity:
     $$\text{similarity}(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}$$
   - Top-$K$ ranked retrieval with citation metadata preservation (Document ID, Title, Paragraph Offset, Relevance Score).

3. **Context Injection (`app/rag/rag_service.py`)**
   - Formats retrieved excerpts into augmented prompts for the AI Reasoning Engine.
