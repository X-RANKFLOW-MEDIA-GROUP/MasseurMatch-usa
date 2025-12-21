-- =============================================================================
-- Migration: Add Rating and Availability Columns to Therapists Table
-- Date: 2025-12-21
-- Description: Adds columns for ratings, pricing, availability to replace mock data
-- =============================================================================

-- Add rating columns
ALTER TABLE therapists
  ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5.00),
  ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
  ADD COLUMN IF NOT EXISTS is_highest_rated BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS has_highest_review BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Add availability columns
ALTER TABLE therapists
  ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS incall_available BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS outcall_available BOOLEAN DEFAULT FALSE;

-- Add pricing columns (if not already exist from previous schema)
-- These might already exist, so we use IF NOT EXISTS
ALTER TABLE therapists
  ADD COLUMN IF NOT EXISTS starting_price_usd INTEGER CHECK (starting_price_usd >= 0),
  ADD COLUMN IF NOT EXISTS rate_60_usd INTEGER CHECK (rate_60_usd >= 0),
  ADD COLUMN IF NOT EXISTS rate_90_usd INTEGER CHECK (rate_90_usd >= 0),
  ADD COLUMN IF NOT EXISTS rate_120_usd INTEGER CHECK (rate_120_usd >= 0);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_therapists_rating ON therapists(rating DESC) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_therapists_is_featured ON therapists(is_featured) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_therapists_is_available ON therapists(is_available) WHERE status = 'approved';

-- Add comments for documentation
COMMENT ON COLUMN therapists.rating IS 'Average rating from 0.00 to 5.00';
COMMENT ON COLUMN therapists.rating_count IS 'Total number of ratings received';
COMMENT ON COLUMN therapists.is_highest_rated IS 'Automatically set for top 10% rated therapists';
COMMENT ON COLUMN therapists.has_highest_review IS 'True if rating_count > 100';
COMMENT ON COLUMN therapists.is_featured IS 'Featured therapists (premium listing or top rated)';
COMMENT ON COLUMN therapists.is_available IS 'Current availability status';
COMMENT ON COLUMN therapists.incall_available IS 'Accepts clients at their location';
COMMENT ON COLUMN therapists.outcall_available IS 'Travels to client location';
COMMENT ON COLUMN therapists.starting_price_usd IS 'Starting price in USD for marketing display';

-- =============================================================================
-- Function to automatically update is_highest_rated flag
-- =============================================================================
CREATE OR REPLACE FUNCTION update_highest_rated_therapists()
RETURNS void AS $$
BEGIN
  -- Reset all flags first
  UPDATE therapists SET is_highest_rated = FALSE;

  -- Set flag for top 10% of therapists by rating
  WITH ranked_therapists AS (
    SELECT
      id,
      rating,
      PERCENT_RANK() OVER (ORDER BY rating DESC) as percentile
    FROM therapists
    WHERE status = 'approved' AND rating > 0
  )
  UPDATE therapists t
  SET is_highest_rated = TRUE
  FROM ranked_therapists rt
  WHERE t.id = rt.id AND rt.percentile <= 0.10;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Trigger to update has_highest_review when rating_count changes
-- =============================================================================
CREATE OR REPLACE FUNCTION update_has_highest_review()
RETURNS TRIGGER AS $$
BEGIN
  NEW.has_highest_review := (NEW.rating_count > 100);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_has_highest_review
  BEFORE INSERT OR UPDATE OF rating_count ON therapists
  FOR EACH ROW
  EXECUTE FUNCTION update_has_highest_review();

-- =============================================================================
-- Trigger to update is_featured based on ratings
-- =============================================================================
CREATE OR REPLACE FUNCTION update_is_featured()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-feature if: highly rated OR many reviews OR manually featured
  NEW.is_featured := (
    NEW.rating >= 4.8 OR
    NEW.rating_count > 100 OR
    NEW.is_highest_rated OR
    COALESCE(NEW.is_featured, FALSE) -- Preserve manual featuring
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_is_featured
  BEFORE INSERT OR UPDATE OF rating, rating_count, is_highest_rated ON therapists
  FOR EACH ROW
  EXECUTE FUNCTION update_is_featured();

-- =============================================================================
-- Optional: Seed some realistic data for testing
-- =============================================================================
-- Uncomment to populate test data:
/*
UPDATE therapists
SET
  rating = 4.0 + (RANDOM() * 1.0),
  rating_count = FLOOR(RANDOM() * 150)::INTEGER,
  is_available = (RANDOM() > 0.3),
  incall_available = (RANDOM() > 0.2),
  outcall_available = (RANDOM() > 0.4),
  starting_price_usd = 80 + (FLOOR(RANDOM() * 100))::INTEGER
WHERE status = 'approved';
*/

-- Run the function to set initial highest_rated flags
SELECT update_highest_rated_therapists();

-- =============================================================================
-- Rollback Instructions
-- =============================================================================
-- If you need to rollback this migration, run:
--
-- DROP TRIGGER IF EXISTS trigger_update_has_highest_review ON therapists;
-- DROP TRIGGER IF EXISTS trigger_update_is_featured ON therapists;
-- DROP FUNCTION IF EXISTS update_has_highest_review();
-- DROP FUNCTION IF EXISTS update_is_featured();
-- DROP FUNCTION IF EXISTS update_highest_rated_therapists();
--
-- ALTER TABLE therapists
--   DROP COLUMN IF EXISTS rating,
--   DROP COLUMN IF EXISTS rating_count,
--   DROP COLUMN IF EXISTS is_highest_rated,
--   DROP COLUMN IF EXISTS has_highest_review,
--   DROP COLUMN IF EXISTS is_featured,
--   DROP COLUMN IF EXISTS is_available,
--   DROP COLUMN IF EXISTS incall_available,
--   DROP COLUMN IF EXISTS outcall_available,
--   DROP COLUMN IF EXISTS starting_price_usd,
--   DROP COLUMN IF EXISTS rate_60_usd,
--   DROP COLUMN IF EXISTS rate_90_usd,
--   DROP COLUMN IF EXISTS rate_120_usd;
-- =============================================================================
