-- ============================================
-- MasseurMatch Therapists Table Setup
-- ============================================
-- Run this in Supabase SQL Editor to create the complete database structure

-- 1. Create therapists table
CREATE TABLE IF NOT EXISTS public.therapists (
  -- Primary Key
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Information
  full_name text,
  display_name text,
  headline text,
  about text,
  philosophy text,

  -- Contact Information
  email text,
  phone text,
  website text,
  instagram text,
  whatsapp text,

  -- Location Information
  city text,
  state text,
  country text DEFAULT 'USA',
  neighborhood text,
  address text,
  zip_code text,
  nearest_intersection text,
  latitude text,
  longitude text,
  mobile_service_radius integer, -- in miles

  -- Service Headlines
  services_headline text,
  specialties_headline text,
  promotions_headline text,

  -- Services Arrays
  services text[],
  massage_techniques text[],
  studio_amenities text[],
  mobile_extras text[],
  additional_services text[],
  products_used text,

  -- Pricing
  rate_60 text,
  rate_90 text,
  rate_outcall text,
  payment_methods text[],

  -- Discounts & Promotions
  regular_discounts text,
  day_of_week_discount text,
  weekly_specials text,
  special_discount_groups text[],

  -- Availability (JSON object)
  availability jsonb,

  -- Professional Information
  degrees text,
  affiliations text[],
  massage_start_date date,
  languages text[],
  business_trips text[],

  -- Ratings & Reviews
  rating numeric(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  override_reviews_count integer DEFAULT 0,

  -- Personal Information
  birthdate date,
  years_experience integer,

  -- Media
  profile_photo text,
  gallery text[],

  -- Legal
  agree_terms boolean DEFAULT false,

  -- Subscription & Billing
  plan text DEFAULT 'free',
  plan_name text,
  price_monthly numeric(10,2),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
  paid_until timestamptz,
  subscription_status text DEFAULT 'inactive',
  stripe_current_period_end timestamptz,

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create profiles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id uuid REFERENCES public.therapists(user_id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_therapists_city ON public.therapists(city);
CREATE INDEX IF NOT EXISTS idx_therapists_state ON public.therapists(state);
CREATE INDEX IF NOT EXISTS idx_therapists_status ON public.therapists(status);
CREATE INDEX IF NOT EXISTS idx_therapists_services ON public.therapists USING gin(services);
CREATE INDEX IF NOT EXISTS idx_therapists_rating ON public.therapists(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_therapist_id ON public.reviews(therapist_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for therapists table

-- Public can view active therapists
CREATE POLICY "Public can view active therapists"
  ON public.therapists
  FOR SELECT
  USING (status = 'active');

-- Users can view their own profile regardless of status
CREATE POLICY "Users can view their own therapist profile"
  ON public.therapists
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own therapist profile"
  ON public.therapists
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own therapist profile"
  ON public.therapists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 7. RLS Policies for profiles table

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 8. RLS Policies for reviews table

-- Public can view all reviews
CREATE POLICY "Public can view all reviews"
  ON public.reviews
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can insert reviews
CREATE POLICY "Authenticated users can insert reviews"
  ON public.reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 9. Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_therapists_updated_at ON public.therapists;
CREATE TRIGGER update_therapists_updated_at
  BEFORE UPDATE ON public.therapists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 11. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.therapists TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.reviews TO anon, authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Therapists table structure created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Tables created:';
  RAISE NOTICE '   - public.therapists';
  RAISE NOTICE '   - public.profiles';
  RAISE NOTICE '   - public.reviews';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 Row Level Security (RLS) enabled with policies';
  RAISE NOTICE '📊 Indexes created for performance';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '   1. Run seed_fake_therapist.sql to create test data';
  RAISE NOTICE '   2. Test the API endpoints';
  RAISE NOTICE '   3. Build the frontend components';
END $$;
