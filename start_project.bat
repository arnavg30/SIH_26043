@echo off
echo Starting SIH_26043 Project Servers...
echo.

echo 1. Starting AI Service (Port 8000)...
start "AI Service" cmd /c "cd /d C:\Users\Arnav\.gemini\antigravity\scratch\ai-service && python -m uvicorn main:app --port 8000"

echo 2. Starting Node.js Backend (Port 5000)...
start "Backend API" cmd /c "cd /d C:\Users\Arnav\.gemini\antigravity\scratch\sih_clean_repo\backend && node server.js"

echo 3. Starting React Frontend (Port 8443)...
start "Frontend UI" cmd /c "cd /d C:\Users\Arnav\.gemini\antigravity\scratch\sih_clean_repo && npm run dev"

echo.
echo All servers are starting in separate windows!
echo Make sure Ollama app is also running in the background for AI features.
pause
