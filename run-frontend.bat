@echo off
title Sankalp IAS - Frontend Server (Port 5173)
echo ===================================================
echo   Sankalp IAS - UPSC Education Portal Frontend
echo ===================================================

cd /d "%~dp0frontend"

if not exist "node_modules\" (
    echo [INFO] Installing frontend dependencies...
    call npm install
)

echo.
echo [INFO] Starting Vite React development server on http://localhost:5173...
echo Press Ctrl + C to stop the server.
echo.
call npm run dev
pause

