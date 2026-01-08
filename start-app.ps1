# ========================================
# Complete Application Launcher
# Starts both Backend and Frontend
# ========================================

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   📚 Document Q&A Assistant (RAG)     ║" -ForegroundColor Cyan
Write-Host "║   Complete Application Launcher        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if backend .env exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  Backend .env file not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please set up your backend environment first:" -ForegroundColor White
    Write-Host "1. Navigate to the backend directory: cd backend" -ForegroundColor White
    Write-Host "2. Copy the example file: Copy-Item .env.example .env" -ForegroundColor White
    Write-Host "3. Edit .env and add your MongoDB URI and other settings" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 0
    }
}

Write-Host "🎯 This will start both the backend and frontend servers" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📝 Note: Two terminal windows will open" -ForegroundColor Yellow
Write-Host "   - Keep both windows open while using the application" -ForegroundColor Yellow
Write-Host "   - Press Ctrl+C in each window to stop the servers" -ForegroundColor Yellow
Write-Host ""

$response = Read-Host "Ready to start? (y/n)"
if ($response -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🚀 Starting servers..." -ForegroundColor Green
Write-Host ""

# Start backend in a new terminal
Write-Host "📡 Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\start-backend.ps1"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 3

# Start frontend in a new terminal
Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\start-frontend.ps1"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Application is starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend:  http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Wait a few seconds for both servers to fully start" -ForegroundColor Yellow
Write-Host "🌐 Then open http://localhost:3000 in your browser" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Enter to close this window..." -ForegroundColor Gray
Read-Host
