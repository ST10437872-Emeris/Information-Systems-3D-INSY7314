@echo off
setlocal
cd /d "%~dp0"
TITLE HustleHubPlus - Check setup
WHERE node >NUL 2>&1
IF ERRORLEVEL 1 (ECHO Install Node.js LTS first.& PAUSE& EXIT /B 1)
node "scripts\doctor.js"
ECHO.
PAUSE
