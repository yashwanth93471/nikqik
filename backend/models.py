from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class DocumentType(str, Enum):
    """Supported document types"""
    PDF = "pdf"
    DOCX = "docx"
    TXT = "txt"
    MARKDOWN = "md"


class ProcessingStatus(str, Enum):
    """Document processing status"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class DocumentChunk(BaseModel):
    """Represents a chunk of document text"""
    chunk_id: str
    document_id: str
    document_name: str
    content: str
    embedding: Optional[List[float]] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    chunk_index: int
    total_chunks: int
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Document(BaseModel):
    """Document metadata"""
    document_id: str
    filename: str
    file_type: DocumentType
    file_size: int
    status: ProcessingStatus
    total_chunks: int = 0
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None
    error_message: Optional[str] = None


class UploadResponse(BaseModel):
    """Response for document upload"""
    success: bool
    document_id: str
    filename: str
    message: str
    total_chunks: Optional[int] = None


class Citation(BaseModel):
    """Citation information for an answer"""
    document_name: str
    chunk_index: int
    content_preview: str
    relevance_score: float


class QueryRequest(BaseModel):
    """Request for querying the knowledge base"""
    question: str
    top_k: int = Field(default=5, ge=1, le=10)


class QueryResponse(BaseModel):
    """Response for a query"""
    answer: str
    citations: List[Citation]
    retrieved_chunks: int
    processing_time: float


class ChatMessage(BaseModel):
    """Chat message"""
    role: str  # "user" or "assistant"
    content: str
    citations: Optional[List[Citation]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class KnowledgeBaseStats(BaseModel):
    """Statistics about the knowledge base"""
    total_documents: int
    total_chunks: int
    documents: List[Document]


class ErrorResponse(BaseModel):
    """Error response"""
    error: str
    detail: Optional[str] = None
