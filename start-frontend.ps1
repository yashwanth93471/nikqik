# ========================================
# Frontend Startup Script for Document Q&A
# ========================================

Write-Host "🚀 Starting Document Q&A Frontend..." -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend directory
Set-Location -Path "$PSScriptRoot\frontend"

# Check if .env.local file exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ ERROR: .env.local file not found!" -ForegroundColor Red
    Write-Host "📝 Creating .env.local with default settings..." -ForegroundColor Yellow
    @"
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
"@ | Out-File -FilePath ".env.local" -Encoding utf8
    Write-Host "✅ Created .env.local file" -ForegroundColor Green
    Write-Host ""
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Dependencies not found. Installing..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

# Start the frontend development server
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Frontend is starting on http://localhost:3000" -ForegroundColor Green
Write-Host "🌐 Open your browser to access the application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
