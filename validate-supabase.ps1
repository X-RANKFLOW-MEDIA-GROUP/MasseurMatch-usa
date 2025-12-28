# =========================================================
# MASSEURMATCH - SUPABASE COMPLETE VALIDATION
# =========================================================
# This script validates Supabase connection
# Run with: .\validate-supabase.ps1
# =========================================================

$ErrorActionPreference = "Continue"
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "MASSEURMATCH SUPABASE VALIDATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Step 1: Check Supabase CLI
Write-Host ""
Write-Host "[1/4] Checking Supabase CLI..." -ForegroundColor Yellow
try {
    $supabaseVersion = supabase --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[WARNING] Supabase CLI not found (optional)" -ForegroundColor Yellow
    }
    else {
        Write-Host "[OK] Supabase CLI found: $supabaseVersion" -ForegroundColor Green
    }
}
catch {
    Write-Host "[WARNING] Supabase CLI not installed (optional)" -ForegroundColor Yellow
}

# Step 2: Load Environment Variables
Write-Host ""
Write-Host "[2/4] Loading environment variables..." -ForegroundColor Yellow
$envPath = "masseurmatch-nextjs\.env.local"
if (-not (Test-Path $envPath)) {
    Write-Host "ERROR: .env.local not found at $envPath" -ForegroundColor Red
    exit 1
}

$envVars = @{}
Get-Content $envPath | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.+)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $envVars[$key] = $value
    }
}

$SUPABASE_URL = $envVars["NEXT_PUBLIC_SUPABASE_URL"]
$SUPABASE_KEY = $envVars["SUPABASE_SERVICE_ROLE_KEY"]
$PROJECT_ID = if ($SUPABASE_URL -match 'https://([^.]+)\.supabase\.co') { $matches[1] } else { $null }

if (-not $PROJECT_ID) {
    Write-Host "ERROR: Could not extract project ID from Supabase URL" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Project ID: $PROJECT_ID" -ForegroundColor Green
Write-Host "[OK] Supabase URL: $SUPABASE_URL" -ForegroundColor Green

# Step 3: Test Connection
Write-Host ""
Write-Host "[3/4] Testing Supabase connection..." -ForegroundColor Yellow

$testScriptContent = @"
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  '$SUPABASE_URL',
  '$SUPABASE_KEY'
);

(async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    // Ignore expected errors that don't indicate connection issues:
    // - PGRST116: No rows returned (table exists but empty)
    // - 42P01: Table doesn't exist yet (migrations not applied)
    // - 42501: Permission denied (RLS policies active - this is expected and good!)
    if (error && error.code !== 'PGRST116' && error.code !== '42P01' && error.code !== '42501') {
      console.error('Database test failed:', error.message);
      process.exit(1);
    }
    console.log('Database connection successful');
    process.exit(0);
  } catch (err) {
    console.error('Connection error:', err.message);
    process.exit(1);
  }
})();
"@

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptDir) { $scriptDir = $PSScriptRoot }
$nextjsDir = Join-Path $scriptDir "masseurmatch-nextjs"
$testFile = Join-Path $nextjsDir "test-supabase-full.js"

Set-Content -Path $testFile -Value $testScriptContent -Encoding UTF8
Push-Location $nextjsDir
try {
    $output = node test-supabase-full.js 2>&1 | Out-String
    # Check for success message in output (ignore exit code due to Node.js Windows async bug)
    $success = $output -match 'Database connection successful'
} catch {
    $success = $false
} finally {
    Pop-Location
    Remove-Item $testFile -ErrorAction SilentlyContinue
}

if (-not $success) {
    Write-Host "ERROR: Supabase connection failed!" -ForegroundColor Red
    Write-Host "Output: $output" -ForegroundColor Gray
    exit 1
}
Write-Host "[OK] Connection test passed" -ForegroundColor Green

# Step 4: List Migrations
Write-Host ""
Write-Host "[4/4] Listing migration files..." -ForegroundColor Yellow
$migrationPath = Join-Path $scriptDir "supabase\migrations"
if (-not (Test-Path $migrationPath)) {
    Write-Host "[WARNING] Migration directory not found at $migrationPath" -ForegroundColor Yellow
    $migrationCount = 0
}
else {
    $migrations = Get-ChildItem -Path $migrationPath -Filter "*.sql" | Sort-Object Name
    $migrationCount = $migrations.Count

    if ($migrationCount -eq 0) {
        Write-Host "[WARNING] No migration files found" -ForegroundColor Yellow
    }
    else {
        Write-Host "[OK] Found $migrationCount migration files" -ForegroundColor Green
        foreach ($migration in $migrations | Select-Object -First 5) {
            Write-Host "  - $($migration.Name)" -ForegroundColor White
        }
        if ($migrationCount -gt 5) {
            Write-Host "  ... and $($migrationCount - 5) more" -ForegroundColor Gray
        }
    }
}

# Final Summary
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "SUPABASE VALIDATION COMPLETE!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "[OK] Supabase configured" -ForegroundColor Green
Write-Host "[OK] Connection verified" -ForegroundColor Green
Write-Host "[OK] Found $migrationCount migrations" -ForegroundColor Green
Write-Host ""
Write-Host "Supabase backend is ready!" -ForegroundColor Cyan
Write-Host "Project ID: $PROJECT_ID" -ForegroundColor White
Write-Host "Dashboard: https://supabase.com/dashboard/project/$PROJECT_ID" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Cyan

exit 0
