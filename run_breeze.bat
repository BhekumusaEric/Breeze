@echo off
title Breeze Youth OS - Application Engine
echo ======================================================================
echo   Breeze Youth OS: Young Person's Life Starter Pack ^& Automation
echo ======================================================================
echo Starting Breeze Web Dashboard on http://127.0.0.1:8765 ...
echo Opening your default browser...
start http://127.0.0.1:8765
python "%~dp0apps\web\app.py"
pause

