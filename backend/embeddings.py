"""
Embeddings Module - FREE VERSION (Hugging Face)
No API costs - completely free!
"""

import os
from typing import List
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()


class EmbeddingGenerator:
    """Generate embeddings using FREE Sentence Transformers"""
    
    def __init__(self, model_name: str = None):
        """
        Initialize embedding generator with free model
        
        Args:
            model_name: Sentence transformer model to use
        """
        # Use free, high-quality embedding model
        self.model_name = model_name or os.getenv(
            "EMBEDDING_MODEL", 
            "sentence-transformers/all-MiniLM-L6-v2"
        )
        
        print(f"🆓 Loading FREE embedding model: {self.model_name}")
        # This downloads the model first time (cached after)
        self.model = SentenceTransformer(self.model_name)
        print("✅ FREE embedding model loaded!")
    
    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for a single text (FREE!)
        
        Args:
            text: Text to embed
            
        Returns:
            Embedding vector
        """
        # Clean text
        text = text.replace("\n", " ").strip()
        
        if not text:
            raise ValueError("Cannot generate embedding for empty text")
        
        # Generate embedding (completely free!)
        embedding = self.model.encode(text, convert_to_numpy=True)
        
        return embedding.tolist()
    
    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts in batch (FREE!)
        
        Args:
            texts: List of texts to embed
            
        Returns:
            List of embedding vectors
        """
        # Clean texts
        cleaned_texts = [text.replace("\n", " ").strip() for text in texts]
        
        # Filter empty texts
        non_empty_texts = [t for t in cleaned_texts if t]
        
        if not non_empty_texts:
            raise ValueError("Cannot generate embeddings for empty texts")
        
        # Generate embeddings in batch (free and fast!)
        print(f"🆓 Generating {len(non_empty_texts)} embeddings (FREE)...")
        embeddings = self.model.encode(
            non_empty_texts, 
            convert_to_numpy=True,
            show_progress_bar=True  # Show progress for large batches
        )
        
        return [emb.tolist() for emb in embeddings]
    
    def get_embedding_dimension(self) -> int:
        """
        Get the dimension of embeddings for this model
        
        Returns:
            Embedding dimension
        """
        # all-MiniLM-L6-v2 produces 384-dimensional vectors
        return self.model.get_sentence_embedding_dimension()

