@echo off
setlocal
cd /d "%~dp0backend"
TITLE HustleHubPlus - Backend API
ECHO ================================================
ECHO  HustleHubPlus Backend (HTTP localhost:5000)
ECHO ================================================
IF NOT EXIST "src\server.js" (ECHO Missing src\server.js. Re-extract ZIP.& PAUSE& EXIT /B 1)
IF NOT EXIST ".env" (ECHO Missing backend\.env. Run 01_SETUP_WINDOWS.bat first.& PAUSE& EXIT /B 1)
IF NOT EXIST "node_modules\express" (ECHO Missing dependencies. Run 01_SETUP_WINDOWS.bat first.& PAUSE& EXIT /B 1)
ECHO Ensure MongoDB Windows service is RUNNING before starting.
ECHO This server uses HTTP for localhost development (not HTTPS).
ECHO.
CALL npm run dev
ECHO.
ECHO Backend ended or crashed. Read the error above; press a key to close.
PAUSE
