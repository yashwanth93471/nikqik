# 📚 Document Q&A Assistant (RAG)

A powerful AI-powered document question-answering system using Retrieval-Augmented Generation (RAG). Upload documents and ask questions that are answered strictly based on the document's content with clear citations.

## 🚀 Quick Start

**New to this project? Start here:**

1. **One-Click Launch**: Double-click `start-app.bat` or `start-app.ps1`
2. **Read the Guide**: See [QUICK_START.md](QUICK_START.md) for detailed setup instructions
3. **Open Browser**: Navigate to http://localhost:3000

## 🌟 Features

- **Multi-Format Support**: Upload PDF, DOCX, TXT, and Markdown files
- **Intelligent Chunking**: Automatic text segmentation with configurable overlap
- **Vector Search**: MongoDB-powered semantic search
- **Citation-Based Answers**: Every answer includes source references
- **Modern UI**: Beautiful, responsive interface with dark mode
- **Real-time Processing**: Live upload and indexing status
- **Knowledge Management**: Clear chat history and reset knowledge base
- **FREE Option**: Use free Hugging Face models instead of paid OpenAI (see [FREE_SETUP.md](FREE_SETUP.md))

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Next.js   │─────▶│   FastAPI   │─────▶│   MongoDB   │
│  Frontend   │      │   Backend   │      │   Vector    │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  AI Models  │
                     │ OpenAI/HF   │
                     └─────────────┘
```

### Components:

1. **Frontend (Next.js)**
   - Document upload interface
   - Real-time chat UI
   - Status indicators
   - Knowledge base management

2. **Backend (FastAPI)**
   - Document processing pipeline
   - Text extraction (PDF, DOCX, TXT, MD)
   - Chunking with overlap (500-1000 tokens)
   - Embedding generation
   - RAG query processing

3. **Vector Database (MongoDB)**
   - Document metadata storage
   - Vector embeddings with Atlas Search
   - Efficient similarity search

4. **LLM Integration**
   - **Paid**: OpenAI (GPT-4 + text-embedding-ada-002)
   - **FREE**: Hugging Face (Mistral-7B + MiniLM)

## 📖 Usage Guide

### 1. Upload Documents
- Click "Upload Document" button
- Select PDF, DOCX, TXT, or MD files
- Watch real-time processing status
- Documents are automatically chunked and indexed

### 2. Ask Questions
- Type your question in the chat input
- System retrieves relevant chunks (top-k=5)
- Receives grounded answer with citations
- Citations show source document and section

### 3. Manage Knowledge Base
- **Clear Chat**: Remove conversation history
- **Reset Knowledge Base**: Delete all indexed documents
- **View Status**: See indexed documents count

## 🎯 Technical Implementation

### Chunking Strategy
- **Size**: 500-1000 tokens (configurable, default: 800)
- **Overlap**: 200 tokens to maintain context
- **Method**: Recursive text splitting with sentence boundaries

### Retrieval
- **Top-K**: 5 most relevant chunks
- **Similarity**: Cosine similarity on embeddings
- **Threshold**: Minimum 0.7 relevance score

### Answer Generation
- **Model**: GPT-4 or Mistral-7B
- **Temperature**: 0.1 (deterministic)
- **System Prompt**: Strict grounding instructions
- **Citation Format**: [Document: {name}, Section: {id}]

### Grounding Rules
1. Answer ONLY from retrieved context
2. Include citations for every claim
3. If uncertain, state "I couldn't find this information"
4. Never hallucinate or use external knowledge

## 🏛️ Project Structure

```
nikqik/
├── start-app.bat              # One-click launcher (Windows)
├── start-app.ps1              # PowerShell launcher
├── start-backend.ps1          # Backend only
├── start-frontend.ps1         # Frontend only
├── QUICK_START.md             # Quick setup guide
├── backend/
│   ├── main.py                # FastAPI application
│   ├── document_processor.py  # Document extraction & chunking
│   ├── embeddings.py          # AI embeddings
│   ├── vector_store.py        # MongoDB vector operations
│   ├── rag_engine.py          # RAG query processing
│   ├── models.py              # Pydantic models
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── app/
│   │   ├── page.tsx          # Main application
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ChatInterface.tsx # Chat UI
│   │   ├── DocumentUpload.tsx# Upload component
│   │   └── KnowledgeBase.tsx # KB management
│   ├── package.json
│   └── .env.local
└── docs/                      # Additional documentation
```

## 🔧 API Endpoints

### Document Management
- `POST /api/upload` - Upload and index document
- `GET /api/documents` - List indexed documents
- `DELETE /api/documents/{id}` - Delete document
- `POST /api/reset` - Clear knowledge base

### Query
- `POST /api/query` - Ask question with RAG
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/clear` - Clear chat history

## 🐛 Troubleshooting

See [QUICK_START.md](QUICK_START.md) for detailed troubleshooting steps.

### Common Issues

**MongoDB Connection Failed**
- Verify MongoDB URI in `backend/.env`
- Check network access in MongoDB Atlas
- Ensure IP whitelist includes your address (use 0.0.0.0/0 for testing)

**Backend won't start**
- Activate virtual environment: `backend\.venv\Scripts\Activate.ps1`
- Install dependencies: `pip install -r requirements.txt`

**Frontend won't start**
- Install dependencies: `cd frontend && npm install`
- Check `.env.local` exists with correct API URL

## 📚 Additional Documentation

- [QUICK_START.md](QUICK_START.md) - Detailed setup guide
- [FREE_SETUP.md](FREE_SETUP.md) - Using free AI models
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Project architecture
- [REQUIREMENTS_CHECKLIST.md](REQUIREMENTS_CHECKLIST.md) - Feature checklist

## 📝 License

MIT License - Feel free to use for learning and projects

## 👨‍💻 Author

Built as an AI Intern Assignment demonstrating RAG implementation skills

## 🙏 Acknowledgments

- OpenAI for GPT-4 and embeddings API
- Hugging Face for free AI models
- MongoDB for vector search capabilities
- Next.js and FastAPI communities
