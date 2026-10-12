@echo off
setlocal
cd /d "%~dp0"
TITLE HustleHubPlus - Test Suite
ECHO ================================================
ECHO  HustleHubPlus verification (local machine)
ECHO ================================================
IF NOT EXIST "backend\node_modules\supertest" (ECHO Run 01_SETUP_WINDOWS.bat first.& PAUSE& EXIT /B 1)
IF NOT EXIST "frontend\node_modules\vitest" (ECHO Run 01_SETUP_WINDOWS.bat first.& PAUSE& EXIT /B 1)
ECHO.
ECHO [1/4] Backend static syntax checks
CALL npm run check --prefix "backend"
IF ERRORLEVEL 1 GOTO :fail
ECHO.
ECHO [2/4] Backend route/authorization unit tests
CALL npm test --prefix "backend"
IF ERRORLEVEL 1 GOTO :fail
ECHO.
ECHO [3/4] Frontend interaction tests
CALL npm test --prefix "frontend"
IF ERRORLEVEL 1 GOTO :fail
ECHO.
ECHO [4/4] Frontend production build
CALL npm run build --prefix "frontend"
IF ERRORLEVEL 1 GOTO :fail
ECHO.
ECHO PASS: Local automated test commands passed.
ECHO Note: still run the Postman/Newman integration tests against MongoDB.
PAUSE
EXIT /B 0
:fail
ECHO.
ECHO TESTS FAILED. Take a screenshot and read the error above.
PAUSE
EXIT /B 1
