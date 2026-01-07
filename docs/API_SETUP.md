# 🔑 API Keys and Manual Setup Guide

This document provides detailed instructions for obtaining API keys and manually configuring the Document Q&A Assistant.

---

## 📋 Table of Contents

1. [OpenAI API Key Setup](#1-openai-api-key-setup)
2. [MongoDB Atlas Setup](#2-mongodb-atlas-setup)
3. [Environment Configuration](#3-environment-configuration)
4. [Manual Updates Required](#4-manual-updates-required)
5. [Verification Steps](#5-verification-steps)

---

## 1. OpenAI API Key Setup

### Step 1.1: Create OpenAI Account

1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Sign up with your email or Google/Microsoft account
3. Verify your email address

### Step 1.2: Add Payment Method

⚠️ **Important**: You need a paid account with GPT-4 access

1. Go to [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Click **"Add payment method"**
3. Enter your credit card details
4. Add initial credits (minimum $5 recommended)

### Step 1.3: Generate API Key

1. Navigate to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Give it a name (e.g., "Document QA Assistant")
4. **Copy the key immediately** - you won't be able to see it again!
5. Format: `sk-proj-...` or `sk-...`

### Step 1.4: Verify GPT-4 Access

1. Go to [https://platform.openai.com/account/limits](https://platform.openai.com/account/limits)
2. Check if you have access to:
   - ✅ `gpt-4` or `gpt-4-turbo`
   - ✅ `text-embedding-ada-002`

**If you don't have GPT-4 access:**
- You need to add at least $5 in credits
- Wait a few minutes for access to be granted
- Alternatively, use `gpt-3.5-turbo` (update `LLM_MODEL` in `.env`)

### Cost Estimates

**Per document (average):**
- Embedding (Ada-002): ~$0.01 per 10 pages
- Query (GPT-4): ~$0.03 per query

**Monthly estimate (moderate use):**
- 50 documents: ~$5
- 500 queries: ~$15
- **Total: ~$20/month**

---

## 2. MongoDB Atlas Setup

### Step 2.1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with email or Google account
3. Verify your email

### Step 2.2: Create a Free Cluster

1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select a cloud provider (AWS recommended)
4. Choose a region close to you
5. Cluster name: `DocumentQA` (or any name)
6. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 2.3: Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `docqa_user` (or your choice)
5. **Generate a secure password** and save it!
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 2.4: Whitelist Your IP Address

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Option A: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ Less secure but easier for development
4. Option B: Click **"Add Current IP Address"**
   - ✅ More secure but need to update if IP changes
5. Click **"Confirm"**

### Step 2.5: Get Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Python** (or any, doesn't matter)
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```
6. **Replace `<username>` and `<password>`** with your actual credentials:
   ```
   mongodb+srv://docqa_user:YourPassword123@cluster0.xxxxx.mongodb.net/
   ```

⚠️ **Important**: If your password contains special characters, URL encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`

### Step 2.6: Create Database (Optional)

The database will be created automatically, but you can create it manually:

1. Click **"Browse Collections"**
2. Click **"Add My Own Data"**
3. Database name: `document_qa`
4. Collection name: `documents`
5. Click **"Create"**

---

## 3. Environment Configuration

### Step 3.1: Backend Configuration

1. Navigate to the backend folder:
   ```bash
   cd c:\Users\yashw\Downloads\nikqik\backend
   ```

2. Create `.env` file from the example:
   ```bash
   copy .env.example .env
   ```

3. Open `backend\.env` in a text editor

4. **Update the following values:**

   ```env
   # REQUIRED: Your OpenAI API Key
   OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_API_KEY_HERE
   
   # REQUIRED: Your MongoDB Connection String
   MONGODB_URI=mongodb+srv://docqa_user:YourPassword123@cluster0.xxxxx.mongodb.net/
   
   # Database name (can keep default)
   MONGODB_DB_NAME=document_qa
   
   # Optional: Adjust these if needed
   CHUNK_SIZE=800
   CHUNK_OVERLAP=200
   TOP_K=5
   MAX_FILE_SIZE_MB=10
   EMBEDDING_MODEL=text-embedding-ada-002
   LLM_MODEL=gpt-4
   LLM_TEMPERATURE=0.1
   ```

5. **Save the file**

### Step 3.2: Frontend Configuration

1. Navigate to the frontend folder:
   ```bash
   cd c:\Users\yashw\Downloads\nikqik\frontend
   ```

2. Create `.env.local` file:
   ```bash
   echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
   ```

   Or manually create `frontend\.env.local` with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Save the file**

---

## 4. Manual Updates Required

### ✅ Required Updates Checklist

- [ ] **Backend `.env` file created** with OpenAI API key
- [ ] **Backend `.env` file updated** with MongoDB URI
- [ ] **Frontend `.env.local` file created** with API URL
- [ ] **MongoDB IP whitelisted** in Atlas
- [ ] **MongoDB user created** with read/write permissions
- [ ] **OpenAI account has credits** (minimum $5)
- [ ] **GPT-4 access verified** in OpenAI account

### 🔧 Optional Customizations

#### Adjust Chunk Size

In `backend\.env`, modify:
```env
CHUNK_SIZE=1000  # Larger chunks (more context)
CHUNK_OVERLAP=300  # More overlap
```

**When to adjust:**
- Larger chunks: Better for documents with long-form content
- Smaller chunks: Better for precise fact retrieval

#### Change LLM Model

In `backend\.env`, modify:
```env
LLM_MODEL=gpt-3.5-turbo  # Cheaper, faster, less accurate
# or
LLM_MODEL=gpt-4-turbo  # Faster GPT-4 variant
```

#### Adjust Retrieval

In `backend\.env`, modify:
```env
TOP_K=10  # Retrieve more chunks (more context, slower)
```

#### Change File Size Limit

In `backend\.env`, modify:
```env
MAX_FILE_SIZE_MB=20  # Allow larger files
```

---

## 5. Verification Steps

### Step 5.1: Test OpenAI Connection

Create a test file `test_openai.py`:

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Test embedding
response = client.embeddings.create(
    input="Hello, world!",
    model="text-embedding-ada-002"
)
print("✅ Embedding test passed!")

# Test GPT-4
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Say hello!"}]
)
print(f"✅ GPT-4 test passed! Response: {response.choices[0].message.content}")
```

Run:
```bash
cd backend
python test_openai.py
```

### Step 5.2: Test MongoDB Connection

Create a test file `test_mongodb.py`:

```python
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("MONGODB_DB_NAME")]

# Test connection
try:
    client.server_info()
    print("✅ MongoDB connection successful!")
    
    # Test write
    test_collection = db["test"]
    test_collection.insert_one({"test": "data"})
    print("✅ MongoDB write successful!")
    
    # Clean up
    test_collection.delete_many({})
    print("✅ MongoDB test complete!")
except Exception as e:
    print(f"❌ MongoDB error: {e}")
```

Run:
```bash
cd backend
python test_mongodb.py
```

### Step 5.3: Test Full System

1. Start backend:
   ```bash
   cd backend
   venv\Scripts\activate
   uvicorn main:app --reload
   ```

2. In a new terminal, start frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open browser to `http://localhost:3000`

4. Upload the test document: `tests\sample_documents\company_policy.txt`

5. Ask: "What is the vacation policy?"

6. Verify you get an answer with citations

---

## 🎯 Summary: What You Need

### Required API Keys/Accounts

| Service | What You Need | Where to Get It | Cost |
|---------|---------------|-----------------|------|
| **OpenAI** | API Key with GPT-4 access | [platform.openai.com](https://platform.openai.com) | ~$20/month |
| **MongoDB** | Atlas connection string | [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) | Free (M0 tier) |

### Files to Update Manually

| File | What to Update | Example |
|------|----------------|---------|
| `backend\.env` | `OPENAI_API_KEY` | `sk-proj-abc123...` |
| `backend\.env` | `MONGODB_URI` | `mongodb+srv://user:pass@cluster...` |
| `frontend\.env.local` | `NEXT_PUBLIC_API_URL` | `http://localhost:8000` |

### No Code Changes Required

✅ All code is ready to run - you only need to configure environment variables!

---

## 🆘 Getting Help

### Common Issues

**"Invalid API key"**
- Check for extra spaces in `.env` file
- Ensure key starts with `sk-`
- Verify key is active in OpenAI dashboard

**"MongoDB connection timeout"**
- Check IP is whitelisted
- Verify connection string format
- Ensure password is URL-encoded

**"GPT-4 not available"**
- Add credits to OpenAI account
- Wait a few minutes after adding credits
- Use `gpt-3.5-turbo` as alternative

### Support Resources

- OpenAI Support: [help.openai.com](https://help.openai.com)
- MongoDB Support: [support.mongodb.com](https://support.mongodb.com)
- Project Issues: Check the README.md troubleshooting section

---

## 🎉 You're Ready!

Once you've completed all the steps above, you're ready to run the Document Q&A Assistant!

Follow the [Quick Start Guide](QUICK_START.md) to launch the application.

---

**Last Updated**: January 2024
