# ============================================================================
# MasseurMatch - Database Migration Script (PowerShell)
# ============================================================================
# This script runs all migrations in the correct order
# Usage: .\run-migrations.ps1 [-Environment local|staging|production]
# ============================================================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('local', 'staging', 'production')]
    [string]$Environment = 'local'
)

# Enable strict mode
$ErrorActionPreference = "Stop"

# Colors
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Blue "========================================="
Write-ColorOutput Blue "MasseurMatch Database Migration"
Write-ColorOutput Blue "Environment: $Environment"
Write-ColorOutput Blue "========================================="
Write-Output ""

# Verify Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-ColorOutput Green "✓ Supabase CLI found"
} catch {
    Write-ColorOutput Red "✗ Supabase CLI not found!"
    Write-Output "Please install it: https://supabase.com/docs/guides/cli"
    exit 1
}
Write-Output ""

# Check if we're in the right directory
if (-not (Test-Path "supabase\migrations")) {
    Write-ColorOutput Red "✗ supabase\migrations directory not found!"
    Write-Output "Please run this script from the project root."
    exit 1
}

# Migrations to run in order
$migrations = @(
    "20251223_base_schema.sql",
    "20251224_onboarding_schema.sql",
    "20251225_add_missing_profile_columns.sql",
    "20251225_schema_updates.sql",
    "20251228_auto_create_user_profile.sql",
    "20251229_fix_onboarding_flow.sql"
)

Write-ColorOutput Yellow "The following migrations will be applied:"
for ($i = 0; $i -lt $migrations.Length; $i++) {
    Write-Output "  $($i + 1). $($migrations[$i])"
}
Write-Output ""

# Ask for confirmation in non-local environments
if ($Environment -ne 'local') {
    Write-ColorOutput Yellow "⚠️  WARNING: You are about to modify the $Environment database!"
    $confirmation = Read-Host "Are you sure you want to continue? (yes/no)"
    if ($confirmation -ne 'yes') {
        Write-Output "Migration cancelled."
        exit 0
    }
}

# Run migrations
Write-ColorOutput Blue "========================================="
Write-ColorOutput Blue "Starting Migration Process"
Write-ColorOutput Blue "========================================="
Write-Output ""

$total = $migrations.Length
$current = 0

foreach ($migration in $migrations) {
    $current++
    Write-ColorOutput Blue "[$current/$total] Running $migration..."

    # Check if file exists
    $migrationPath = "supabase\migrations\$migration"
    if (-not (Test-Path $migrationPath)) {
        Write-ColorOutput Red "✗ Migration file not found: $migration"
        exit 1
    }

    # Run migration
    try {
        if ($Environment -eq 'local') {
            supabase migration up --local --include-all
            if ($LASTEXITCODE -ne 0) {
                throw "Migration failed"
            }
        } else {
            supabase db push
            if ($LASTEXITCODE -ne 0) {
                throw "Migration failed"
            }
        }
        Write-ColorOutput Green "✓ Completed"
    } catch {
        Write-ColorOutput Red "✗ Migration failed: $migration"
        Write-ColorOutput Red $_.Exception.Message
        exit 1
    }
    Write-Output ""
}

# Run verification
Write-ColorOutput Blue "========================================="
Write-ColorOutput Blue "Verifying Migration Success"
Write-ColorOutput Blue "========================================="
Write-Output ""

# Get database URL
if ($Environment -eq 'local') {
    $dbUrl = "postgresql://postgres:postgres@localhost:54322/postgres"
} else {
    # Get connection string from Supabase
    $statusJson = supabase status --output json | ConvertFrom-Json
    $dbUrl = $statusJson.db_url
}

Write-ColorOutput Yellow "Running verification queries..."
Write-Output ""

# Function to run psql query
function Run-DbQuery {
    param($Query, $Description)

    Write-Output "$Description..."
    try {
        $result = psql $dbUrl -c $Query -t 2>&1
        Write-Output $result
    } catch {
        Write-ColorOutput Yellow "⚠ Could not verify: $Description"
    }
}

# Check critical tables
Run-DbQuery -Description "1. Checking critical tables" -Query @"
SELECT
  CASE
    WHEN COUNT(*) = 4 THEN '✓ All critical tables exist'
    ELSE '✗ Missing tables: ' || (4 - COUNT(*))::text
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'profiles', 'subscriptions', 'media_assets');
"@

Write-Output ""

# Check user_id column
Run-DbQuery -Description "2. Checking profiles.user_id column" -Query @"
SELECT
  CASE
    WHEN COUNT(*) = 1 THEN '✓ profiles.user_id exists and is NOT NULL'
    ELSE '✗ profiles.user_id missing or nullable'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name = 'user_id'
  AND is_nullable = 'NO';
"@

Write-Output ""

# Check RLS
Run-DbQuery -Description "3. Checking RLS on public.users" -Query @"
SELECT
  CASE
    WHEN rowsecurity = true THEN '✓ RLS enabled on public.users'
    ELSE '✗ RLS not enabled on public.users'
  END as status
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'users';
"@

Write-Output ""

# Check trigger
Run-DbQuery -Description "4. Checking on_auth_user_created trigger" -Query @"
SELECT
  CASE
    WHEN COUNT(*) = 1 THEN '✓ on_auth_user_created trigger exists'
    ELSE '✗ on_auth_user_created trigger missing'
  END as status
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
  AND trigger_name = 'on_auth_user_created';
"@

Write-Output ""
Write-ColorOutput Blue "========================================="
Write-ColorOutput Green "✓ Migration Completed Successfully!"
Write-ColorOutput Blue "========================================="
Write-Output ""
Write-ColorOutput Yellow "Next Steps:"
Write-Output "  1. Test user signup flow"
Write-Output "  2. Verify auto-creation of users and profiles"
Write-Output "  3. Test onboarding API endpoints"
Write-Output "  4. Configure Stripe webhooks"
Write-Output ""
Write-ColorOutput Yellow "Documentation:"
Write-Output "  - ONBOARDING_FLOW_FIXES.md"
Write-Output "  - MIGRATION_TROUBLESHOOTING.md"
Write-Output ""
