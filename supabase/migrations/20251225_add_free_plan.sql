-- Add 'free' plan to subscription_plan_enum
ALTER TYPE subscription_plan_enum ADD VALUE IF NOT EXISTS 'free';

-- Note: PostgreSQL requires the new value to be added at the end of the enum
-- The order will be: 'standard', 'pro', 'elite', 'free'
-- To reorder, you would need to recreate the enum, which is more complex
