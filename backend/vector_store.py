"""
Vector Store Module
Handles MongoDB vector storage and similarity search
"""

import os
from typing import List, Dict, Any, Optional
from datetime import datetime
import numpy as np
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from dotenv import load_dotenv

from models import DocumentChunk, Document, ProcessingStatus

load_dotenv()


class VectorStore:
    """MongoDB-based vector store for document chunks"""
    
    def __init__(self):
        """Initialize MongoDB connection"""
        mongodb_uri = os.getenv("MONGODB_URI")
        db_name = os.getenv("MONGODB_DB_NAME", "document_qa")
        
        if not mongodb_uri:
            raise ValueError("MONGODB_URI environment variable not set")
        
        self.client = MongoClient(mongodb_uri)
        self.db = self.client[db_name]
        
        # Collections
        self.chunks_collection = self.db["chunks"]
        self.documents_collection = self.db["documents"]
        
        # Create indexes
        self._create_indexes()
    
    def _create_indexes(self):
        """Create necessary indexes"""
        # Index for document_id lookups
        self.chunks_collection.create_index("document_id")
        self.documents_collection.create_index("document_id", unique=True)
        
        # Index for chunk_id
        self.chunks_collection.create_index("chunk_id", unique=True)
    
    def store_document(self, document: Document) -> bool:
        """
        Store document metadata
        
        Args:
            document: Document metadata
            
        Returns:
            True if successful
        """
        try:
            self.documents_collection.insert_one(document.model_dump())
            return True
        except DuplicateKeyError:
            # Update existing document
            self.documents_collection.update_one(
                {"document_id": document.document_id},
                {"$set": document.model_dump()}
            )
            return True
    
    def store_chunk(self, chunk: DocumentChunk) -> bool:
        """
        Store a document chunk with embedding
        
        Args:
            chunk: Document chunk with embedding
            
        Returns:
            True if successful
        """
        try:
            self.chunks_collection.insert_one(chunk.model_dump())
            return True
        except DuplicateKeyError:
            # Update existing chunk
            self.chunks_collection.update_one(
                {"chunk_id": chunk.chunk_id},
                {"$set": chunk.model_dump()}
            )
            return True
    
    def store_chunks_batch(self, chunks: List[DocumentChunk]) -> int:
        """
        Store multiple chunks in batch
        
        Args:
            chunks: List of document chunks
            
        Returns:
            Number of chunks stored
        """
        if not chunks:
            return 0
        
        chunk_dicts = [chunk.model_dump() for chunk in chunks]
        result = self.chunks_collection.insert_many(chunk_dicts, ordered=False)
        return len(result.inserted_ids)
    
    def similarity_search(
        self, 
        query_embedding: List[float], 
        top_k: int = 5,
        min_score: float = 0.0
    ) -> List[Dict[str, Any]]:
        """
        Perform similarity search using cosine similarity
        
        Args:
            query_embedding: Query embedding vector
            top_k: Number of results to return
            min_score: Minimum similarity score threshold
            
        Returns:
            List of matching chunks with scores
        """
        # Get all chunks with embeddings
        all_chunks = list(self.chunks_collection.find({"embedding": {"$exists": True}}))
        
        if not all_chunks:
            return []
        
        # Calculate cosine similarity for each chunk
        results = []
        query_vec = np.array(query_embedding)
        query_norm = np.linalg.norm(query_vec)
        
        for chunk in all_chunks:
            chunk_vec = np.array(chunk["embedding"])
            chunk_norm = np.linalg.norm(chunk_vec)
            
            # Cosine similarity
            if query_norm > 0 and chunk_norm > 0:
                similarity = np.dot(query_vec, chunk_vec) / (query_norm * chunk_norm)
            else:
                similarity = 0.0
            
            if similarity >= min_score:
                results.append({
                    "chunk": chunk,
                    "score": float(similarity)
                })
        
        # Sort by score and return top_k
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]
    
    def get_document(self, document_id: str) -> Optional[Dict[str, Any]]:
        """Get document metadata by ID"""
        return self.documents_collection.find_one({"document_id": document_id})
    
    def get_all_documents(self) -> List[Dict[str, Any]]:
        """Get all documents"""
        return list(self.documents_collection.find())
    
    def get_chunks_by_document(self, document_id: str) -> List[Dict[str, Any]]:
        """Get all chunks for a document"""
        return list(self.chunks_collection.find({"document_id": document_id}))
    
    def delete_document(self, document_id: str) -> bool:
        """
        Delete a document and all its chunks
        
        Args:
            document_id: Document ID to delete
            
        Returns:
            True if successful
        """
        # Delete chunks
        self.chunks_collection.delete_many({"document_id": document_id})
        
        # Delete document
        result = self.documents_collection.delete_one({"document_id": document_id})
        
        return result.deleted_count > 0
    
    def clear_all(self) -> bool:
        """
        Clear all documents and chunks
        
        Returns:
            True if successful
        """
        self.chunks_collection.delete_many({})
        self.documents_collection.delete_many({})
        return True
    
    def get_stats(self) -> Dict[str, int]:
        """
        Get knowledge base statistics
        
        Returns:
            Dictionary with counts
        """
        return {
            "total_documents": self.documents_collection.count_documents({}),
            "total_chunks": self.chunks_collection.count_documents({})
        }
    
    def update_document_status(
        self, 
        document_id: str, 
        status: ProcessingStatus,
        total_chunks: Optional[int] = None,
        error_message: Optional[str] = None
    ) -> bool:
        """
        Update document processing status
        
        Args:
            document_id: Document ID
            status: New status
            total_chunks: Total number of chunks (optional)
            error_message: Error message if failed (optional)
            
        Returns:
            True if successful
        """
        update_data = {
            "status": status.value,
            "processed_at": datetime.utcnow()
        }
        
        if total_chunks is not None:
            update_data["total_chunks"] = total_chunks
        
        if error_message is not None:
            update_data["error_message"] = error_message
        
        result = self.documents_collection.update_one(
            {"document_id": document_id},
            {"$set": update_data}
        )
        
        return result.modified_count > 0
