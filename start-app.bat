@echo off
REM ========================================
REM Complete Application Launcher (Batch)
REM Starts both Backend and Frontend
REM ========================================

echo.
echo ╔════════════════════════════════════════╗
echo ║   📚 Document Q^&A Assistant (RAG)     ║
echo ║   Complete Application Launcher        ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if backend .env exists
if not exist "backend\.env" (
    echo ⚠️  Backend .env file not found!
    echo.
    echo Please set up your backend environment first:
    echo 1. Navigate to the backend directory: cd backend
    echo 2. Copy the example file: copy .env.example .env
    echo 3. Edit .env and add your MongoDB URI and other settings
    echo.
    set /p continue="Do you want to continue anyway? (y/n): "
    if /i not "%continue%"=="y" exit /b
)

echo 🎯 This will start both the backend and frontend servers
echo    Backend:  http://localhost:8000
echo    Frontend: http://localhost:3000
echo.
echo 📝 Note: Two terminal windows will open
echo    - Keep both windows open while using the application
echo    - Press Ctrl+C in each window to stop the servers
echo.

set /p response="Ready to start? (y/n): "
if /i not "%response%"=="y" (
    echo Cancelled.
    exit /b
)

echo.
echo 🚀 Starting servers...
echo.

REM Start backend in a new terminal
echo 📡 Starting Backend Server...
start "Document Q&A - Backend" cmd /k "cd /d %~dp0 && powershell -ExecutionPolicy Bypass -File start-backend.ps1"

REM Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

REM Start frontend in a new terminal
echo 🌐 Starting Frontend Server...
start "Document Q&A - Frontend" cmd /k "cd /d %~dp0 && powershell -ExecutionPolicy Bypass -File start-frontend.ps1"

echo.
echo ========================================
echo ✅ Application is starting!
echo ========================================
echo.
echo 📍 Backend:  http://localhost:8000/docs
echo 📍 Frontend: http://localhost:3000
echo.
echo ⏳ Wait a few seconds for both servers to fully start
echo 🌐 Then open http://localhost:3000 in your browser
echo.
echo Press any key to close this window...
pause >nul
