# 📝 Setup Summary - What You Need to Do

## 🎯 Quick Reference: APIs and Manual Updates

This document summarizes exactly what you need to configure manually to run the Document Q&A Assistant.

---

## 1️⃣ GET THESE API KEYS

### OpenAI API Key
- **Where**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **What**: Create new secret key
- **Cost**: ~$20/month for moderate use
- **Format**: `sk-proj-...` or `sk-...`
- **Requirements**: 
  - ✅ Paid account with credits ($5 minimum)
  - ✅ GPT-4 access (automatic after adding credits)

### MongoDB Connection String
- **Where**: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **What**: Create free M0 cluster
- **Cost**: FREE
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/`
- **Requirements**:
  - ✅ Create database user
  - ✅ Whitelist your IP address (or use 0.0.0.0/0)

---

## 2️⃣ UPDATE THESE FILES

### File 1: `backend\.env`

**Location**: `c:\Users\yashw\Downloads\nikqik\backend\.env`

**Action**: Create this file (copy from `.env.example`) and update:

```env
# REPLACE THIS with your actual OpenAI API key
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE

# REPLACE THIS with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

# These can stay as default
MONGODB_DB_NAME=document_qa
CHUNK_SIZE=800
CHUNK_OVERLAP=200
TOP_K=5
MAX_FILE_SIZE_MB=10
EMBEDDING_MODEL=text-embedding-ada-002
LLM_MODEL=gpt-4
LLM_TEMPERATURE=0.1
```

### File 2: `frontend\.env.local`

**Location**: `c:\Users\yashw\Downloads\nikqik\frontend\.env.local`

**Action**: Create this file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 3️⃣ NO CODE CHANGES NEEDED

✅ **All code is complete and ready to run!**

You do NOT need to modify any `.py`, `.tsx`, or `.ts` files.

---

## 4️⃣ INSTALLATION STEPS

### Backend Setup

```bash
# 1. Navigate to backend
cd c:\Users\yashw\Downloads\nikqik\backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file and add your API keys (see section 2 above)

# 6. Start server
uvicorn main:app --reload
```

### Frontend Setup

```bash
# 1. Open NEW terminal and navigate to frontend
cd c:\Users\yashw\Downloads\nikqik\frontend

# 2. Install dependencies
npm install

# 3. Create .env.local file (see section 2 above)

# 4. Start server
npm run dev
```

### Open Application

```
http://localhost:3000
```

---

## 5️⃣ VERIFICATION CHECKLIST

Before running, verify:

- [ ] OpenAI API key is valid (starts with `sk-`)
- [ ] OpenAI account has credits ($5+)
- [ ] MongoDB cluster is created
- [ ] MongoDB user is created with password
- [ ] MongoDB IP is whitelisted
- [ ] `backend\.env` file exists with correct values
- [ ] `frontend\.env.local` file exists
- [ ] Python virtual environment is activated
- [ ] All dependencies are installed (backend and frontend)

---

## 6️⃣ FIRST TEST

1. **Start both servers** (backend and frontend)
2. **Open** `http://localhost:3000`
3. **Upload** the test document: `tests\sample_documents\company_policy.txt`
4. **Ask**: "What is the vacation policy?"
5. **Expect**: Answer with citation showing "15 days"

If this works, you're all set! 🎉

---

## 7️⃣ COST BREAKDOWN

### One-Time Costs
- None! Everything uses free tiers or pay-as-you-go

### Monthly Costs (Estimated)

| Service | Usage | Cost |
|---------|-------|------|
| MongoDB Atlas | M0 Free Tier | **$0** |
| OpenAI Embeddings | 50 documents (~500 pages) | ~$5 |
| OpenAI GPT-4 | 500 queries | ~$15 |
| **Total** | Moderate use | **~$20/month** |

### Cost Optimization Tips
- Use `gpt-3.5-turbo` instead of `gpt-4` (10x cheaper)
- Reduce `TOP_K` to retrieve fewer chunks
- Increase `CHUNK_SIZE` to reduce total chunks

---

## 8️⃣ TROUBLESHOOTING

### "Invalid API key"
→ Check `backend\.env` has correct OpenAI key

### "MongoDB connection failed"
→ Verify MongoDB URI and IP whitelist

### "Module not found"
→ Run `pip install -r requirements.txt` or `npm install`

### "Port already in use"
→ Kill existing process or use different port

### "GPT-4 not available"
→ Add credits to OpenAI account, wait a few minutes

---

## 9️⃣ DETAILED GUIDES

For more detailed instructions, see:

- **[API_SETUP.md](API_SETUP.md)** - Step-by-step API key setup
- **[QUICK_START.md](QUICK_START.md)** - Detailed installation guide
- **[README.md](../README.md)** - Full project documentation
- **[architecture.md](architecture.md)** - System architecture
- **[test_cases.md](test_cases.md)** - Testing guide

---

## 🎯 SUMMARY

### What You Need:
1. ✅ OpenAI API key (from platform.openai.com)
2. ✅ MongoDB connection string (from mongodb.com/atlas)

### What You Update:
1. ✅ `backend\.env` - Add API keys
2. ✅ `frontend\.env.local` - Add API URL

### What You Don't Touch:
1. ❌ No Python code changes
2. ❌ No TypeScript/React code changes
3. ❌ No configuration files beyond `.env`

### Time Required:
- API setup: 15 minutes
- Installation: 10 minutes
- First test: 2 minutes
- **Total: ~30 minutes**

---

## 📞 NEED HELP?

1. Check the troubleshooting section above
2. Review [API_SETUP.md](API_SETUP.md) for detailed steps
3. Verify all checklist items are complete
4. Check browser console (F12) for frontend errors
5. Check terminal for backend errors

---

**You're ready to build an amazing RAG application! 🚀**

Good luck with your AI internship assignment!
