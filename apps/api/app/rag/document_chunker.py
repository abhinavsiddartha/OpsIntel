import re
from typing import List, Dict, Any

class DocumentChunker:
    @staticmethod
    def chunk_text(text: str, chunk_size: int = 300, overlap: int = 50) -> List[str]:
        # Split by periods, newlines, or paragraphs
        sentences = re.split(r'(?<=[.?!])\s+|\n+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        chunks = []
        current_chunk = []
        current_len = 0
        
        for sentence in sentences:
            current_chunk.append(sentence)
            current_len += len(sentence)
            if current_len >= chunk_size:
                chunks.append(" ".join(current_chunk))
                # retain last sentence as overlap
                current_chunk = current_chunk[-1:] if overlap > 0 else []
                current_len = sum(len(s) for s in current_chunk)
                
        if current_chunk and (" ".join(current_chunk) not in chunks):
            chunks.append(" ".join(current_chunk))
            
        return chunks if chunks else [text]
