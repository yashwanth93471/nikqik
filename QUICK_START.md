# 🚀 Quick Start Guide - Document Q&A Assistant

This guide will help you get the application running in **5 minutes or less**!

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ **Node.js 18+** installed ([Download here](https://nodejs.org/))
- ✅ **Python 3.9+** installed ([Download here](https://www.python.org/downloads/))
- ✅ **MongoDB Atlas account** (free tier) ([Sign up here](https://www.mongodb.com/cloud/atlas))

## 🎯 Three Ways to Start

### Option 1: 🚀 One-Click Start (Recommended)

**Double-click** `start-app.ps1` in the project root folder.

This will:
- ✅ Check all dependencies
- ✅ Install missing packages
- ✅ Start both backend and frontend servers
- ✅ Open two terminal windows (keep both open!)

Then open your browser to: **http://localhost:3000**

---

### Option 2: 🔧 Manual Start (Two Terminals)

**Terminal 1 - Backend:**
```powershell
# Double-click start-backend.ps1
# OR run manually:
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```powershell
# Double-click start-frontend.ps1
# OR run manually:
cd frontend
npm run dev
```

Then open: **http://localhost:3000**

---

### Option 3: 📝 First-Time Setup (Detailed)

#### Step 1: Backend Setup

1. **Navigate to backend:**
   ```powershell
   cd backend
   ```

2. **Create virtual environment:**
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

3. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```powershell
   # Copy the example file
   Copy-Item .env.example .env
   
   # Edit .env and add your settings:
   # - MONGODB_URI (from MongoDB Atlas)
   # - HUGGINGFACE_API_TOKEN (optional, for better models)
   notepad .env
   ```

5. **Start backend:**
   ```powershell
   uvicorn main:app --reload
   ```
   
   ✅ Backend running at: http://localhost:8000

#### Step 2: Frontend Setup

1. **Open a NEW terminal and navigate to frontend:**
   ```powershell
   cd frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Configure environment (auto-created if missing):**
   ```powershell
   # File: .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start frontend:**
   ```powershell
   npm run dev
   ```
   
   ✅ Frontend running at: http://localhost:3000

---

## 🔑 Getting Your MongoDB URI

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a **FREE** account (no credit card needed)
3. Create a new cluster (select **FREE M0 tier**)
4. Click **"Connect"** → **"Connect your application"**
5. Copy the connection string
6. Replace `<password>` with your database password
7. Paste into `backend/.env` as `MONGODB_URI`

**Example:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## 🎯 Using the Application

### 1. Upload Documents
- Click **"Upload Document"** button
- Select PDF, DOCX, TXT, or MD files
- Wait for processing (you'll see a success message)

### 2. Ask Questions
- Type your question in the chat box
- Press Enter or click Send
- Get answers with citations from your documents

### 3. Manage Knowledge Base
- **Clear Chat**: Remove conversation history
- **Reset Knowledge Base**: Delete all uploaded documents

---

## 🐛 Troubleshooting

### Backend won't start

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

### Frontend won't start

**Problem:** `Error: Cannot find module 'next'`

**Solution:**
```powershell
cd frontend
npm install
```

---

### MongoDB connection error

**Problem:** `ServerSelectionTimeoutError`

**Solutions:**
1. ✅ Check your `MONGODB_URI` in `backend/.env`
2. ✅ Verify your IP is whitelisted in MongoDB Atlas:
   - Go to **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (0.0.0.0/0)
3. ✅ Check your database password is correct

---

### Port already in use

**Problem:** `Error: Port 3000 is already in use`

**Solution:**
```powershell
# Kill the process using the port
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or use a different port
npm run dev -- -p 3001
```

---

## 📊 Verify Everything Works

### ✅ Backend Health Check
Open: http://localhost:8000/docs

You should see the FastAPI documentation page.

### ✅ Frontend Health Check
Open: http://localhost:3000

You should see the Document Q&A interface.

### ✅ Full System Test
1. Upload a test document (any PDF or TXT file)
2. Ask a question about the document
3. Verify you get an answer with citations

---

## 🎥 Quick Demo

1. **Upload** a document (e.g., a PDF about Python)
2. **Ask**: "What is Python?"
3. **Receive**: Answer with citation like `[Source: python.pdf, Section: 1]`

---

## 📚 Next Steps

- Read the full [README.md](README.md) for architecture details
- Check [FREE_SETUP.md](FREE_SETUP.md) for using free AI models
- Explore the API docs at http://localhost:8000/docs

---

## 🆘 Still Having Issues?

1. Make sure both backend AND frontend are running
2. Check the terminal windows for error messages
3. Verify your `.env` files are configured correctly
4. Try restarting both servers

---

## 🎉 Success!

If you can upload a document and ask questions, you're all set! 

**Happy querying! 📚✨**
