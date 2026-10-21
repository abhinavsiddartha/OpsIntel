import math
import re
from typing import List, Dict, Any, Tuple
from collections import Counter

class SimpleVectorStore:
    def __init__(self):
        self.documents = []  # list of dicts: {chunk_id, doc_id, doc_title, category, content, tokens}
        self.idf = {}
        
    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r'\b[a-zA-Z0-9_-]{2,}\b', text.lower())
        
    def add_chunks(self, chunks_data: List[Dict[str, Any]]):
        for item in chunks_data:
            tokens = self._tokenize(item["content"])
            self.documents.append({**item, "tokens": tokens, "tf": Counter(tokens)})
        self._compute_idf()
        
    def _compute_idf(self):
        total_docs = len(self.documents)
        if total_docs == 0:
            return
        doc_freq = Counter()
        for doc in self.documents:
            unique_tokens = set(doc["tokens"])
            for t in unique_tokens:
                doc_freq[t] += 1
        self.idf = {
            token: math.log((total_docs + 1) / (freq + 1)) + 1.0
            for token, freq in doc_freq.items()
        }
        
    def search(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        query_tokens = self._tokenize(query)
        if not query_tokens or not self.documents:
            return []
            
        query_tf = Counter(query_tokens)
        scores = []
        
        for doc in self.documents:
            score = 0.0
            for t in query_tokens:
                if t in doc["tf"]:
                    tf_val = doc["tf"][t] / max(len(doc["tokens"]), 1)
                    idf_val = self.idf.get(t, 1.0)
                    score += tf_val * idf_val
                    
            if score > 0.0:
                scores.append((score, doc))
                
        scores.sort(key=lambda x: x[0], reverse=True)
        results = []
        for score, doc in scores[:top_k]:
            results.append({
                "chunk_id": doc["chunk_id"],
                "document_id": doc["document_id"],
                "document_title": doc["document_title"],
                "category": doc["category"],
                "content": doc["content"],
                "similarity_score": round(min(0.99, score * 2.5 + 0.5), 3)
            })
        return results

vector_store = SimpleVectorStore()
