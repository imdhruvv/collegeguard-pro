@echo off
title CollegeGuard Pro - Smart Campus System Launcher
echo ===================================================
echo     CollegeGuard Pro - Smart Campus Management
echo ===================================================
echo.
echo Starting Backend and Frontend Servers...
echo.

cd /d "%~dp0"

echo [1/2] Launching Backend Server (Port 5000)...
start "CollegeGuard Backend" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Launching Frontend Client (Port 3000)...
start "CollegeGuard Frontend" cmd /k "cd client && npm start"

echo.
echo ===================================================
echo Servers started in separate windows!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo ===================================================
pause
