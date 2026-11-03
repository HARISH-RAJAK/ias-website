@echo off
title Sankalp IAS - Backend Server (Port 8000)
echo ===================================================
echo   Sankalp IAS - UPSC Education Portal API Backend
echo ===================================================

cd /d "%~dp0backend"

:: Check if php is in system PATH
where php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    goto START_SERVER
)

:: Check standard XAMPP location
if exist "C:\xampp\php\php.exe" (
    echo [INFO] Found PHP in C:\xampp\php
    set "PATH=C:\xampp\php;%PATH%"
    goto START_SERVER
)

:: Check Program Files
if exist "C:\Program Files\PHP\php.exe" (
    echo [INFO] Found PHP in C:\Program Files\PHP
    set "PATH=C:\Program Files\PHP;%PATH%"
    goto START_SERVER
)

echo.
echo [ERROR] PHP executable was not found on your system!
echo.
echo Quick Resolution:
echo 1. If XAMPP is installed, make sure Apache and MySQL are started in XAMPP Control Panel.
echo 2. Add C:\xampp\php to your Windows System Environment Variables (PATH).
echo 3. Alternatively, install PHP via XAMPP: https://www.apachefriends.org/
echo.
pause
exit /b 1

:START_SERVER
echo.
echo [INFO] Starting PHP REST API server on http://localhost:8000...
echo [INFO] Health check available at: http://localhost:8000/api/health
echo Press Ctrl + C to stop the server.
echo.
php -S localhost:8000 -t public
pause

