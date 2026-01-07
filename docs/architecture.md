# Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Upload     │  │     Chat     │  │  Knowledge   │        │
│  │  Component   │  │  Interface   │  │     Base     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│                    Next.js Frontend (Port 3000)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API LAYER                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    FastAPI Server                         │  │
│  │                                                            │  │
│  │  Endpoints:                                               │  │
│  │  • POST /api/upload      - Upload documents              │  │
│  │  • POST /api/query       - Query knowledge base          │  │
│  │  • GET  /api/documents   - List documents                │  │
│  │  • DELETE /api/documents/{id} - Delete document          │  │
│  │  • POST /api/reset       - Reset knowledge base          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│                   Python Backend (Port 8000)                    │
└────────┬──────────────────┬──────────────────┬─────────────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Document      │ │   RAG Engine    │ │  Vector Store   │
│   Processor     │ │                 │ │                 │
│                 │ │                 │ │                 │
│ • PDF Extract   │ │ • Retrieval     │ │ • MongoDB       │
│ • DOCX Extract  │ │ • Generation    │ │ • Embeddings    │
│ • TXT Extract   │ │ • Citation      │ │ • Similarity    │
│ • MD Extract    │ │ • Grounding     │ │   Search        │
│ • Chunking      │ │                 │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │                  │                  │
         └──────────────────┴──────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │         EXTERNAL SERVICES             │
         │                                       │
         │  ┌────────────┐    ┌──────────────┐  │
         │  │  OpenAI    │    │   MongoDB    │  │
         │  │   API      │    │    Atlas     │  │
         │  │            │    │              │  │
         │  │ • GPT-4    │    │ • Documents  │  │
         │  │ • Ada-002  │    │ • Chunks     │  │
         │  │ Embeddings │    │ • Vectors    │  │
         │  └────────────┘    └──────────────┘  │
         └──────────────────────────────────────┘
```

## Data Flow

### 1. Document Upload Flow

```
User → Upload Component → FastAPI
                            │
                            ▼
                    Document Processor
                    (Extract & Chunk)
                            │
                            ▼
                    Embedding Generator
                    (OpenAI Ada-002)
                            │
                            ▼
                      Vector Store
                    (MongoDB Storage)
                            │
                            ▼
                    Status: Completed
```

### 2. Query Flow

```
User Question → Chat Interface → FastAPI
                                   │
                                   ▼
                            RAG Engine
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
            Embedding Generator          Vector Store
            (Query Embedding)         (Similarity Search)
                    │                             │
                    └──────────────┬──────────────┘
                                   ▼
                            Retrieved Chunks
                            (Top-K Results)
                                   │
                                   ▼
                              OpenAI GPT-4
                          (Answer Generation)
                                   │
                                   ▼
                    Answer + Citations → User
```

## Component Details

### Frontend (Next.js)

**Technology Stack:**
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- React Hooks for state management

**Key Components:**
1. **DocumentUpload.tsx**
   - Drag-and-drop file upload
   - Progress tracking
   - File validation
   - Real-time status updates

2. **ChatInterface.tsx**
   - Message history
   - Citation display
   - Real-time responses
   - Citation modal

3. **KnowledgeBase.tsx**
   - Document listing
   - Statistics dashboard
   - Delete operations
   - Reset functionality

### Backend (FastAPI)

**Technology Stack:**
- FastAPI for REST API
- Pydantic for data validation
- Python 3.9+
- Async/await for performance

**Key Modules:**

1. **document_processor.py**
   - Multi-format text extraction
   - Token-based chunking
   - Sentence boundary detection
   - Metadata generation

2. **embeddings.py**
   - OpenAI API integration
   - Batch embedding generation
   - Error handling

3. **vector_store.py**
   - MongoDB operations
   - Cosine similarity search
   - CRUD operations
   - Index management

4. **rag_engine.py**
   - Query processing
   - Context retrieval
   - Answer generation
   - Citation creation
   - Grounding validation

### Database (MongoDB)

**Collections:**

1. **documents**
   ```json
   {
     "document_id": "uuid",
     "filename": "example.pdf",
     "file_type": "pdf",
     "file_size": 1024000,
     "status": "completed",
     "total_chunks": 15,
     "uploaded_at": "2024-01-01T00:00:00Z",
     "processed_at": "2024-01-01T00:01:00Z"
   }
   ```

2. **chunks**
   ```json
   {
     "chunk_id": "uuid_chunk_0",
     "document_id": "uuid",
     "document_name": "example.pdf",
     "content": "chunk text...",
     "embedding": [0.1, 0.2, ...],  // 1536 dimensions
     "metadata": {
       "chunk_index": 0,
       "total_chunks": 15,
       "token_count": 800
     },
     "created_at": "2024-01-01T00:01:00Z"
   }
   ```

## RAG Pipeline Details

### 1. Chunking Strategy

- **Chunk Size**: 500-1000 tokens (default: 800)
- **Overlap**: 200 tokens
- **Method**: Token-based with sentence boundary detection
- **Encoding**: cl100k_base (GPT-4 tokenizer)

### 2. Embedding Generation

- **Model**: text-embedding-ada-002
- **Dimensions**: 1536
- **Batch Processing**: Yes
- **Normalization**: Cosine similarity

### 3. Retrieval

- **Method**: Cosine similarity
- **Top-K**: 5 (configurable)
- **Threshold**: 0.7 minimum score
- **Ranking**: By relevance score

### 4. Generation

- **Model**: GPT-4
- **Temperature**: 0.1 (deterministic)
- **System Prompt**: Strict grounding instructions
- **Max Tokens**: Auto
- **Citation Format**: [Document: name, Section: index]

## Security Considerations

1. **API Keys**: Stored in environment variables
2. **File Upload**: Size limits (10MB default)
3. **File Types**: Whitelist validation
4. **CORS**: Configured for localhost
5. **Input Validation**: Pydantic models
6. **Error Handling**: Comprehensive try-catch blocks

## Scalability Considerations

1. **Background Processing**: Async document processing
2. **Batch Operations**: Bulk embedding generation
3. **Database Indexing**: Optimized queries
4. **Connection Pooling**: MongoDB connection management
5. **Caching**: Potential for Redis integration

## Performance Metrics

- **Upload Processing**: ~2-5 seconds per MB
- **Query Response**: <3 seconds average
- **Embedding Generation**: ~100ms per chunk
- **Similarity Search**: <500ms for 1000 chunks

## Future Enhancements

1. **Multi-user Support**: User authentication and isolation
2. **Advanced Search**: Hybrid search (keyword + semantic)
3. **Conversation Memory**: Multi-turn context
4. **Document Versioning**: Track changes
5. **Analytics Dashboard**: Usage statistics
6. **Export Functionality**: Download Q&A history
7. **Advanced Citations**: Page numbers, highlights
8. **Real-time Collaboration**: Shared knowledge bases
