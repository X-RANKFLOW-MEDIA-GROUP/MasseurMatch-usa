# =========================================================
# MASSEURMATCH - COMPLETE SYSTEM VALIDATION (ONE COMMAND)
# =========================================================
# Recreated from validate-all.ps1 to act as the single gate entrypoint.
# Run with: .\scripts\gate_all.ps1
# =========================================================

$ErrorActionPreference = "Continue"
$startTime = Get-Date

$repoRoot = Split-Path -Parent $PSScriptRoot

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "           MASSEURMATCH COMPLETE VALIDATION                 " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  This script will validate your entire stack:" -ForegroundColor White
Write-Host "  - Backend (Supabase)" -ForegroundColor White
Write-Host "  - Frontend (Next.js)" -ForegroundColor White
Write-Host "  - Database schema and migrations" -ForegroundColor White
Write-Host "  - API connections" -ForegroundColor White
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path (Join-Path $repoRoot "masseurmatch-nextjs"))) {
    Write-Host "ERROR: Run this script from the MasseurMatch-usa root directory!" -ForegroundColor Red
    exit 1
}

$supabaseSuccess = $false
$frontendSuccess = $false

# =========================================================
# PART 1: SUPABASE BACKEND VALIDATION
# =========================================================
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host "  PART 1/2: SUPABASE BACKEND VALIDATION                     " -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host ""

try {
    $supabaseScript = Join-Path $repoRoot "validate-supabase.ps1"
    & $supabaseScript
    if ($LASTEXITCODE -eq 0) {
        $supabaseSuccess = $true
        Write-Host ""
        Write-Host "[OK] SUPABASE VALIDATION PASSED" -ForegroundColor Green
    }
    else {
        Write-Host ""
        Write-Host "[FAIL] SUPABASE VALIDATION FAILED" -ForegroundColor Red
        Write-Host "Continuing to frontend validation anyway..." -ForegroundColor Yellow
    }
}
catch {
    Write-Host ""
    Write-Host "[ERROR] SUPABASE VALIDATION ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Continuing to frontend validation anyway..." -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

# =========================================================
# PART 2: FRONTEND VALIDATION
# =========================================================
Write-Host ""
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host "  PART 2/2: FRONTEND VALIDATION                             " -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host ""

try {
    $frontendScript = Join-Path $repoRoot "validate-frontend.ps1"
    & $frontendScript
    if ($LASTEXITCODE -eq 0) {
        $frontendSuccess = $true
        Write-Host ""
        Write-Host "[OK] FRONTEND VALIDATION PASSED" -ForegroundColor Green
    }
    else {
        Write-Host ""
        Write-Host "[FAIL] FRONTEND VALIDATION FAILED" -ForegroundColor Red
    }
}
catch {
    Write-Host ""
    Write-Host "[ERROR] FRONTEND VALIDATION ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# =========================================================
# FINAL SUMMARY
# =========================================================
$endTime = Get-Date
$duration = ($endTime - $startTime).TotalSeconds

Write-Host ""
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "                   VALIDATION SUMMARY                       " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Results:" -ForegroundColor White

if ($supabaseSuccess) {
    Write-Host "  [OK] Supabase Backend ........ CONNECTED" -ForegroundColor Green
}
else {
    Write-Host "  [X]  Supabase Backend ........ FAILED" -ForegroundColor Red
}

if ($frontendSuccess) {
    Write-Host "  [OK] Next.js Frontend ........ READY" -ForegroundColor Green
}
else {
    Write-Host "  [X]  Next.js Frontend ........ FAILED" -ForegroundColor Red
}

Write-Host ""
Write-Host "Execution time: $([math]::Round($duration, 2)) seconds" -ForegroundColor Gray
Write-Host ""

if ($supabaseSuccess -and $frontendSuccess) {
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "  >>> ALL SYSTEMS OPERATIONAL <<<                          " -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Your MasseurMatch application is fully connected!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Next steps:" -ForegroundColor White
    Write-Host "  1. cd masseurmatch-nextjs" -ForegroundColor White
    Write-Host "  2. npm run dev" -ForegroundColor White
    Write-Host "  3. Open http://localhost:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Green
    exit 0
}
elseif ($frontendSuccess) {
    Write-Host "============================================================" -ForegroundColor Yellow
    Write-Host "  WARNING: PARTIAL SUCCESS                                 " -ForegroundColor Yellow
    Write-Host "============================================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Frontend is ready but Supabase needs attention." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Actions needed:" -ForegroundColor White
    Write-Host "  1. Check Supabase credentials in .env.local" -ForegroundColor White
    Write-Host "  2. Verify migrations applied correctly" -ForegroundColor White
    Write-Host "  3. Re-run: .\\validate-supabase.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Yellow
    exit 1
}
else {
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host "  ERROR: VALIDATION FAILED                                 " -ForegroundColor Red
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Please review the error messages above." -ForegroundColor Red
    Write-Host ""
    Write-Host "  Common fixes:" -ForegroundColor White
    Write-Host "  1. Check .env.local exists and has correct values" -ForegroundColor White
    Write-Host "  2. Run: npm install (in masseurmatch-nextjs)" -ForegroundColor White
    Write-Host "  3. Verify Supabase project is active" -ForegroundColor White
    Write-Host "  4. Check internet connection" -ForegroundColor White
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Red
    exit 1
}
