"""
FastAPI Main Application - FREE VERSION
Document Q&A Assistant with RAG (No API costs!)
"""

import os
import uuid
import time
from pathlib import Path
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import (
    Document, DocumentChunk, ProcessingStatus, DocumentType,
    UploadResponse, QueryRequest, QueryResponse, KnowledgeBaseStats,
    ChatMessage, ErrorResponse
)
from document_processor import DocumentProcessor, validate_file_type
from vector_store import VectorStore

load_dotenv()

# Check if using free version
USE_FREE = os.getenv("USE_FREE_VERSION", "true").lower() == "true"

if USE_FREE:
    print("🆓 Using FREE version with Hugging Face!")
    from embeddings_free import FreeEmbeddingGenerator as EmbeddingGenerator
    from rag_engine_free import FreeRAGEngine as RAGEngine
else:
    print("💰 Using PAID version with OpenAI")
    from embeddings import EmbeddingGenerator
    from rag_engine import RAGEngine

# Initialize FastAPI app
app = FastAPI(
    title="Document Q&A Assistant (FREE VERSION)",
    description="RAG-based document question answering system - No API costs!",
    version="2.0.0-free"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
document_processor = DocumentProcessor(
    chunk_size=int(os.getenv("CHUNK_SIZE", "800")),
    chunk_overlap=int(os.getenv("CHUNK_OVERLAP", "200"))
)
embedding_generator = EmbeddingGenerator()
vector_store = VectorStore()
rag_engine = RAGEngine()

# Upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Chat history
chat_history: List[ChatMessage] = []


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Document Q&A Assistant API (FREE VERSION)",
        "version": "2.0.0-free",
        "status": "running",
        "cost": "$0/month 🎉"
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        stats = vector_store.get_stats()
        return {
            "status": "healthy",
            "database": "connected",
            "version": "free" if USE_FREE else "paid",
            "stats": stats
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unhealthy: {str(e)}")


async def process_document_background(
    document_id: str,
    file_path: str,
    file_type: str,
    filename: str
):
    """Background task to process document"""
    try:
        vector_store.update_document_status(document_id, ProcessingStatus.PROCESSING)
        
        # Process document
        chunks = document_processor.process_document(file_path, file_type, filename)
        
        # Generate embeddings (FREE!)
        print(f"Generating embeddings for {len(chunks)} chunks (FREE)...")
        chunk_texts = [chunk[0] for chunk in chunks]
        embeddings = embedding_generator.generate_embeddings_batch(chunk_texts)
        
        # Create DocumentChunk objects
        document_chunks = []
        for idx, ((chunk_text, metadata), embedding) in enumerate(zip(chunks, embeddings)):
            chunk = DocumentChunk(
                chunk_id=f"{document_id}_chunk_{idx}",
                document_id=document_id,
                document_name=filename,
                content=chunk_text,
                embedding=embedding,
                metadata=metadata,
                chunk_index=metadata["chunk_index"],
                total_chunks=metadata["total_chunks"]
            )
            document_chunks.append(chunk)
        
        # Store chunks
        vector_store.store_chunks_batch(document_chunks)
        
        # Update status
        vector_store.update_document_status(
            document_id,
            ProcessingStatus.COMPLETED,
            total_chunks=len(document_chunks)
        )
        
        # Clean up
        os.remove(file_path)
        print(f"✅ Document processed successfully (FREE)!")
        
    except Exception as e:
        print(f"❌ Error processing document: {e}")
        vector_store.update_document_status(
            document_id,
            ProcessingStatus.FAILED,
            error_message=str(e)
        )
        
        if os.path.exists(file_path):
            os.remove(file_path)


@app.post("/api/upload", response_model=UploadResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """Upload and process a document (FREE!)"""
    try:
        file_type = validate_file_type(file.filename)
        
        # Check file size
        max_size = int(os.getenv("MAX_FILE_SIZE_MB", "10")) * 1024 * 1024
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        
        if file_size > max_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {max_size / 1024 / 1024}MB"
            )
        
        document_id = str(uuid.uuid4())
        
        # Save file
        file_path = UPLOAD_DIR / f"{document_id}_{file.filename}"
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Create document metadata
        document = Document(
            document_id=document_id,
            filename=file.filename,
            file_type=DocumentType(file_type),
            file_size=file_size,
            status=ProcessingStatus.PENDING
        )
        
        vector_store.store_document(document)
        
        # Process in background
        background_tasks.add_task(
            process_document_background,
            document_id,
            str(file_path),
            file_type,
            file.filename
        )
        
        return UploadResponse(
            success=True,
            document_id=document_id,
            filename=file.filename,
            message="Document uploaded successfully. Processing in background (FREE!)."
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.post("/api/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """Query the knowledge base (FREE!)"""
    try:
        start_time = time.time()
        
        # Query RAG engine (FREE!)
        answer, citations = rag_engine.query(request.question, request.top_k)
        
        processing_time = time.time() - start_time
        
        # Add to chat history
        chat_history.append(ChatMessage(
            role="user",
            content=request.question
        ))
        chat_history.append(ChatMessage(
            role="assistant",
            content=answer,
            citations=citations
        ))
        
        return QueryResponse(
            answer=answer,
            citations=citations,
            retrieved_chunks=len(citations),
            processing_time=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@app.get("/api/documents", response_model=KnowledgeBaseStats)
async def get_documents():
    """Get all documents and stats"""
    try:
        documents = vector_store.get_all_documents()
        stats = vector_store.get_stats()
        
        doc_models = [Document(**doc) for doc in documents]
        
        return KnowledgeBaseStats(
            total_documents=stats["total_documents"],
            total_chunks=stats["total_chunks"],
            documents=doc_models
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get documents: {str(e)}")


@app.delete("/api/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document"""
    try:
        success = vector_store.delete_document(document_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Document not found")
        
        return {"success": True, "message": "Document deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")


@app.post("/api/reset")
async def reset_knowledge_base():
    """Clear all documents"""
    try:
        vector_store.clear_all()
        chat_history.clear()
        
        return {"success": True, "message": "Knowledge base reset successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reset failed: {str(e)}")


@app.get("/api/chat/history")
async def get_chat_history():
    """Get chat history"""
    return {"messages": chat_history}


@app.delete("/api/chat/clear")
async def clear_chat_history():
    """Clear chat history"""
    chat_history.clear()
    return {"success": True, "message": "Chat history cleared"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
