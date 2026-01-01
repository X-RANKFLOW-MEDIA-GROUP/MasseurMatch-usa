#!/bin/bash

# ============================================================================
# MasseurMatch - Database Migration Script
# ============================================================================
# This script runs all migrations in the correct order
# Usage: ./run-migrations.sh [environment]
#   environment: local (default) | staging | production
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Environment (default: local)
ENV=${1:-local}

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}MasseurMatch Database Migration${NC}"
echo -e "${BLUE}Environment: ${ENV}${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Verify Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}✗ Supabase CLI not found!${NC}"
    echo "Please install it: https://supabase.com/docs/guides/cli"
    exit 1
fi

echo -e "${GREEN}✓ Supabase CLI found${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "supabase/migrations" ]; then
    echo -e "${RED}✗ supabase/migrations directory not found!${NC}"
    echo "Please run this script from the project root."
    exit 1
fi

# Migrations to run in order
MIGRATIONS=(
    "20251223_base_schema.sql"
    "20251224_onboarding_schema.sql"
    "20251225_add_missing_profile_columns.sql"
    "20251225_schema_updates.sql"
    "20251228_auto_create_user_profile.sql"
    "20251229_fix_onboarding_flow.sql"
)

echo -e "${YELLOW}The following migrations will be applied:${NC}"
for i in "${!MIGRATIONS[@]}"; do
    echo "  $((i+1)). ${MIGRATIONS[$i]}"
done
echo ""

# Ask for confirmation in non-local environments
if [ "$ENV" != "local" ]; then
    echo -e "${YELLOW}⚠️  WARNING: You are about to modify the ${ENV} database!${NC}"
    read -p "Are you sure you want to continue? (yes/no): " -r
    echo
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "Migration cancelled."
        exit 0
    fi
fi

# Run migrations
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Starting Migration Process${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

TOTAL=${#MIGRATIONS[@]}
CURRENT=0

for migration in "${MIGRATIONS[@]}"; do
    CURRENT=$((CURRENT + 1))
    echo -e "${BLUE}[${CURRENT}/${TOTAL}] Running ${migration}...${NC}"

    # Check if file exists
    if [ ! -f "supabase/migrations/${migration}" ]; then
        echo -e "${RED}✗ Migration file not found: ${migration}${NC}"
        exit 1
    fi

    # Run migration
    if [ "$ENV" == "local" ]; then
        supabase migration up --local --include-all || {
            echo -e "${RED}✗ Migration failed: ${migration}${NC}"
            exit 1
        }
    else
        supabase db push || {
            echo -e "${RED}✗ Migration failed: ${migration}${NC}"
            exit 1
        }
    fi

    echo -e "${GREEN}✓ Completed${NC}"
    echo ""
done

# Run verification
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Verifying Migration Success${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Run verification queries
if [ "$ENV" == "local" ]; then
    DB_URL="postgresql://postgres:postgres@localhost:54322/postgres"
else
    # Get connection string from Supabase
    DB_URL=$(supabase status --output json | jq -r '.db_url')
fi

echo -e "${YELLOW}Running verification queries...${NC}"
echo ""

# Check critical tables
echo "1. Checking critical tables..."
psql "$DB_URL" -c "
SELECT
  CASE
    WHEN COUNT(*) = 4 THEN '✓ All critical tables exist'
    ELSE '✗ Missing tables: ' || (4 - COUNT(*))::text
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'profiles', 'subscriptions', 'media_assets');
" 2>/dev/null || echo -e "${YELLOW}⚠ Could not verify tables${NC}"

# Check user_id column
echo ""
echo "2. Checking profiles.user_id column..."
psql "$DB_URL" -c "
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
" 2>/dev/null || echo -e "${YELLOW}⚠ Could not verify user_id column${NC}"

# Check RLS
echo ""
echo "3. Checking RLS on public.users..."
psql "$DB_URL" -c "
SELECT
  CASE
    WHEN rowsecurity = true THEN '✓ RLS enabled on public.users'
    ELSE '✗ RLS not enabled on public.users'
  END as status
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'users';
" 2>/dev/null || echo -e "${YELLOW}⚠ Could not verify RLS${NC}"

# Check trigger
echo ""
echo "4. Checking on_auth_user_created trigger..."
psql "$DB_URL" -c "
SELECT
  CASE
    WHEN COUNT(*) = 1 THEN '✓ on_auth_user_created trigger exists'
    ELSE '✗ on_auth_user_created trigger missing'
  END as status
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
  AND trigger_name = 'on_auth_user_created';
" 2>/dev/null || echo -e "${YELLOW}⚠ Could not verify trigger${NC}"

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}✓ Migration Completed Successfully!${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Test user signup flow"
echo "  2. Verify auto-creation of users and profiles"
echo "  3. Test onboarding API endpoints"
echo "  4. Configure Stripe webhooks"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "  - ONBOARDING_FLOW_FIXES.md"
echo "  - MIGRATION_TROUBLESHOOTING.md"
echo ""
