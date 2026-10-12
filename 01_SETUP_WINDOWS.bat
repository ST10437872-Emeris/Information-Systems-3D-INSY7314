@echo off
setlocal
cd /d "%~dp0"
TITLE HustleHubPlus - Install and Configure
ECHO ================================================
ECHO  HustleHubPlus - ONE-TIME WINDOWS SETUP
ECHO ================================================
ECHO This setup must be run from the extracted HustleHubPlus folder.
WHERE node >NUL 2>&1
IF ERRORLEVEL 1 (ECHO ERROR: Node.js not found. Install Node.js LTS first.& GOTO :fail)
WHERE npm >NUL 2>&1
IF ERRORLEVEL 1 (ECHO ERROR: npm is missing. Reinstall Node.js LTS.& GOTO :fail)
IF NOT EXIST "backend\src\server.js" (ECHO ERROR: backend\src\server.js is missing. Re-extract ZIP.& GOTO :fail)
IF NOT EXIST "frontend\package.json" (ECHO ERROR: frontend\package.json is missing. Re-extract ZIP.& GOTO :fail)
ECHO.
ECHO [1/3] Creating .env files with unique locally generated JWT secret...
node "scripts\prepare-env.js"
IF ERRORLEVEL 1 GOTO :fail
ECHO.
ECHO [2/3] Installing BACKEND packages (internet required)...
CALL npm install --prefix "backend"
IF ERRORLEVEL 1 GOTO :fail
ECHO.
ECHO [3/3] Installing FRONTEND packages (internet required)...
CALL npm install --prefix "frontend"
IF ERRORLEVEL 1 GOTO :fail
ECHO.
ECHO SUCCESS: Setup completed. Ensure MongoDB Server is running.
ECHO Next: double-click 02_START_BACKEND.bat and 03_START_FRONTEND.bat.
ECHO API: http://localhost:5000/api/health
ECHO WEB: http://localhost:5173
PAUSE
EXIT /B 0
:fail
ECHO.
ECHO SETUP STOPPED. Read START_HERE_WINDOWS.md for error fixes.
PAUSE
EXIT /B 1
