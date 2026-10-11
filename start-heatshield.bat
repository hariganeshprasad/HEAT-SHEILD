@echo off
title HeatShield EWS Server
cd /d "%~dp0"
echo ===================================================
echo   Starting HeatShield Early Warning System...
echo   Opening website at http://localhost:3000
echo ===================================================
timeout /t 2 /nobreak >nul
start http://localhost:3000
npm run dev
pause
