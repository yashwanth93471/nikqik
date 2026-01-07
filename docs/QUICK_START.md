# Quick Start Guide

## 🚀 Getting Started in 10 Minutes

This guide will help you set up and run the Document Q&A Assistant quickly.

---

## Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 18+** and npm installed
- ✅ **Python 3.9+** installed
- ✅ **MongoDB Atlas account** (free tier works)
- ✅ **OpenAI API key** with GPT-4 access

---

## Step 1: Clone/Navigate to Project

```bash
cd c:\Users\yashw\Downloads\nikqik
```

---

## Step 2: Backend Setup

### 2.1 Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2.2 Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 2.3 Install Dependencies

```bash
pip install -r requirements.txt
```

### 2.4 Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
# Copy the example file
copy .env.example .env
```

Edit `backend\.env` and add your credentials:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=document_qa
CHUNK_SIZE=800
CHUNK_OVERLAP=200
TOP_K=5
MAX_FILE_SIZE_MB=10
EMBEDDING_MODEL=text-embedding-ada-002
LLM_MODEL=gpt-4
LLM_TEMPERATURE=0.1
```

### 2.5 Start Backend Server

```bash
uvicorn main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Keep this terminal open!

---

## Step 3: Frontend Setup

Open a **NEW terminal** window.

### 3.1 Navigate to Frontend

```bash
cd c:\Users\yashw\Downloads\nikqik\frontend
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Configure Environment Variables

The `.env.local` file should already exist. If not, create it:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3.4 Start Frontend Server

```bash
npm run dev
```

You should see:
```
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

---

## Step 4: Open Application

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the Document Q&A Assistant interface!

---

## Step 5: Test the System

### 5.1 Upload a Document

1. Click on the **Upload** tab
2. Drag and drop `tests/sample_documents/company_policy.txt`
3. Wait for processing to complete (~5-10 seconds)

### 5.2 Ask Questions

1. Click on the **Chat** tab
2. Try these questions:
   - "What is the vacation policy?"
   - "Who is the CEO?"
   - "How many days per week can employees work remotely?"

### 5.3 View Knowledge Base

1. Click on the **Knowledge Base** tab
2. See your uploaded documents and statistics

---

## 🎉 Success!

If you can upload documents and get answers with citations, you're all set!

---

## 🐛 Troubleshooting

### Backend won't start

**Error: "OPENAI_API_KEY not set"**
- Check your `.env` file exists in the `backend` folder
- Ensure the API key is correct (starts with `sk-`)

**Error: "MongoDB connection failed"**
- Verify your MongoDB URI is correct
- Check your IP is whitelisted in MongoDB Atlas
- Ensure your password doesn't contain special characters (or URL encode them)

### Frontend won't start

**Error: "Module not found"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: "Port 3000 already in use"**
```bash
# Use a different port
npm run dev -- -p 3001
```

### Upload fails

**Error: "File too large"**
- Check file is under 10MB
- Adjust `MAX_FILE_SIZE_MB` in `.env` if needed

**Error: "Unsupported file type"**
- Only PDF, DOCX, TXT, and MD files are supported
- Check file extension is correct

### Query returns error

**Error: "No documents found"**
- Ensure documents are fully processed (check Knowledge Base tab)
- Wait a few seconds after upload

**Error: "OpenAI API error"**
- Check your API key is valid
- Verify you have GPT-4 access
- Check your OpenAI account has credits

---

## 📚 Next Steps

1. Read the full [README.md](../README.md)
2. Review [Architecture Documentation](architecture.md)
3. Check out [Test Cases](test_cases.md)
4. Follow the [Demo Script](demo_script.md)

---

## 🔧 Development Tips

### Hot Reload

Both servers support hot reload:
- **Backend**: Changes to `.py` files auto-reload
- **Frontend**: Changes to `.tsx` files auto-reload

### Viewing Logs

**Backend logs:**
- Visible in the terminal running `uvicorn`
- Check for errors in red

**Frontend logs:**
- Browser console (F12 → Console tab)
- Terminal running `npm run dev`

### Database Inspection

Use MongoDB Compass or Atlas UI to view:
- `documents` collection
- `chunks` collection
- Verify embeddings are stored

---

## 🛑 Stopping the Servers

### Backend
Press `Ctrl+C` in the backend terminal

### Frontend
Press `Ctrl+C` in the frontend terminal

### Deactivate Virtual Environment
```bash
deactivate
```

---

## 📝 Configuration Reference

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key | - | ✅ Yes |
| `MONGODB_URI` | MongoDB connection string | - | ✅ Yes |
| `MONGODB_DB_NAME` | Database name | `document_qa` | No |
| `CHUNK_SIZE` | Tokens per chunk | `800` | No |
| `CHUNK_OVERLAP` | Overlap tokens | `200` | No |
| `TOP_K` | Chunks to retrieve | `5` | No |
| `MAX_FILE_SIZE_MB` | Max upload size | `10` | No |
| `EMBEDDING_MODEL` | OpenAI embedding model | `text-embedding-ada-002` | No |
| `LLM_MODEL` | OpenAI chat model | `gpt-4` | No |
| `LLM_TEMPERATURE` | Generation temperature | `0.1` | No |

### Frontend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` | Yes |

---

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [RAG Concepts](https://www.pinecone.io/learn/retrieval-augmented-generation/)

---

**Happy coding! 🚀**
