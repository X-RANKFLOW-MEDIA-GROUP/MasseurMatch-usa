-- Add essential columns to profiles table for onboarding flow
-- This is a minimal migration to get signup working

-- Add user_id column if it doesn't exist (needed for relationship)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add onboarding_stage column with simple text type (avoiding enum for now)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_stage TEXT DEFAULT 'start';

-- Add stripe_customer_id for payment integration
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_stage ON public.profiles(onboarding_stage);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);

-- Update existing profiles to have user_id = id if user_id is null
UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;
