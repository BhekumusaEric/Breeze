# Breeze Launcher PowerShell Script
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  🌬️ Breeze Youth OS: Young Person's Life Starter Pack & Automation" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "Starting Breeze Web Dashboard on http://127.0.0.1:8765 ..." -ForegroundColor Yellow
Write-Host "Opening your default browser..." -ForegroundColor Green

Start-Process "http://127.0.0.1:8765"
$appPath = Join-Path $PSScriptRoot "apps\web\app.py"
python $appPath

