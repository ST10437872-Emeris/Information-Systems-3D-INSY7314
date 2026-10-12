@echo off
setlocal
cd /d "%~dp0frontend"
TITLE HustleHubPlus - React Web App
ECHO ================================================
ECHO  HustleHubPlus React frontend
ECHO ================================================
IF NOT EXIST "package.json" (ECHO Missing frontend\package.json. Re-extract ZIP.& PAUSE& EXIT /B 1)
IF NOT EXIST ".env" (ECHO Missing frontend\.env. Run 01_SETUP_WINDOWS.bat first.& PAUSE& EXIT /B 1)
IF NOT EXIST "node_modules\vite" (ECHO Missing dependencies. Run 01_SETUP_WINDOWS.bat first.& PAUSE& EXIT /B 1)
ECHO Keep the backend terminal open in parallel.
ECHO.
CALL npm run dev
ECHO.
ECHO Frontend ended or crashed. Read the error above; press a key to close.
PAUSE
