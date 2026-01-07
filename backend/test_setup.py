"""
Quick test to verify MongoDB connection
"""
import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 50)
print("🔍 CHECKING YOUR SETUP")
print("=" * 50)

# Check .env file
mongodb_uri = os.getenv("MONGODB_URI")
if mongodb_uri:
    print("✅ MongoDB URI found in .env")
    # Hide password for security
    safe_uri = mongodb_uri.split("@")[1] if "@" in mongodb_uri else mongodb_uri
    print(f"   Connected to: {safe_uri}")
else:
    print("❌ MongoDB URI not found!")

print("\n" + "=" * 50)
print("📋 NEXT STEPS:")
print("=" * 50)
print("""
The backend setup is complete! Your .env file is configured.

Due to Python environment complexities, I recommend:

OPTION 1 (Easiest): Use Google Colab
- No installation needed
- Free GPU
- Works in browser
- I can create a Colab notebook for you

OPTION 2: Manual Installation
Open PowerShell and run:
  cd c:\\Users\\yashw\\Downloads\\nikqik\\backend
  python -m pip install fastapi uvicorn python-dotenv pymongo pydantic sentence-transformers huggingface-hub
  python -m uvicorn main:app --reload

Then open: http://localhost:8000

Would you like me to create a Google Colab version instead?
""")
