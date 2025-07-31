-- =====================================================================================
-- BURGERGRILL RESTAURANT BUSINESS SCHEMA
-- Sauberes, KISS-konformes Schema für Restaurant-Management
-- Kompatibel mit Supabase RLS und bestehender Auth-Infrastruktur
-- =====================================================================================

-- Drop existing tables if they exist (für wiederholbare Migration)
DROP TABLE IF EXISTS public.menu_items CASCADE;
DROP TABLE IF EXISTS public.menu_categories CASCADE;
DROP TABLE IF EXISTS public.special_hours CASCADE;
DROP TABLE IF EXISTS public.opening_hours CASCADE;
DROP TABLE IF EXISTS public.restaurant_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- =====================================================================================
-- CORE USER PROFILES (erweitert existing auth.users)
-- =====================================================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- =====================================================================================
-- RESTAURANT SETTINGS (Business Configuration)
-- =====================================================================================

CREATE TABLE public.restaurant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Business Info
  business_name TEXT DEFAULT 'Burgergrill Restaurant',
  phone TEXT,
  email TEXT,
  
  -- Address  
  street TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Switzerland',
  
  -- Map Integration
  google_maps_url TEXT,
  
  -- Special Notice (für Banner)
  special_notice_text TEXT,
  special_notice_active BOOLEAN DEFAULT false,
  special_notice_priority INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(profile_id),
  CHECK (special_notice_priority >= 1 AND special_notice_priority <= 10)
);

-- Enable RLS
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own restaurant settings" 
  ON public.restaurant_settings FOR ALL 
  USING (profile_id = auth.uid());

-- =====================================================================================
-- OPENING HOURS (Weekly Schedule)
-- =====================================================================================

CREATE TABLE public.opening_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurant_settings(id) ON DELETE CASCADE,
  
  -- Day Configuration (0=Monday, 6=Sunday)
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  
  -- Time Configuration
  is_closed BOOLEAN DEFAULT false,
  open_time TIME, -- Format: '09:00'
  close_time TIME, -- Format: '22:00'
  
  -- Additional Info
  notes TEXT, -- z.B. "Warme Küche bis 21:30"
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(restaurant_id, day_of_week),
  CHECK (
    (is_closed = true) OR 
    (is_closed = false AND open_time IS NOT NULL AND close_time IS NOT NULL)
  ),
  CHECK (open_time < close_time OR (open_time IS NULL AND close_time IS NULL))
);

-- Enable RLS
ALTER TABLE public.opening_hours ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own opening hours" 
  ON public.opening_hours FOR ALL 
  USING (restaurant_id IN (
    SELECT id FROM public.restaurant_settings 
    WHERE profile_id = auth.uid()
  ));

-- =====================================================================================
-- SPECIAL HOURS (Ferien, Feiertage, Sonderöffnungszeiten)
-- =====================================================================================

CREATE TABLE public.special_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurant_settings(id) ON DELETE CASCADE,
  
  -- Date Range
  date_start DATE NOT NULL,
  date_end DATE NOT NULL,
  
  -- Status Configuration
  is_closed BOOLEAN DEFAULT true,
  custom_open_time TIME, -- Falls nicht geschlossen, custom Öffnungszeit
  custom_close_time TIME, -- Falls nicht geschlossen, custom Schließzeit
  
  -- Display Information
  reason TEXT DEFAULT 'Ferien' CHECK (reason IN ('Ferien', 'Feiertag', 'Wartung', 'Event', 'Sonstiges')),
  custom_message TEXT, -- z.B. "Wir sind vom 15.-25. Dezember in den Ferien"
  
  -- Banner Configuration
  show_banner BOOLEAN DEFAULT true,
  banner_priority INTEGER DEFAULT 1 CHECK (banner_priority >= 1 AND banner_priority <= 10),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CHECK (date_start <= date_end),
  CHECK (
    (is_closed = true) OR 
    (is_closed = false AND custom_open_time IS NOT NULL AND custom_close_time IS NOT NULL)
  ),
  CHECK (custom_open_time < custom_close_time OR (custom_open_time IS NULL AND custom_close_time IS NULL))
);

-- Enable RLS  
ALTER TABLE public.special_hours ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own special hours" 
  ON public.special_hours FOR ALL 
  USING (restaurant_id IN (
    SELECT id FROM public.restaurant_settings 
    WHERE profile_id = auth.uid()
  ));

-- =====================================================================================
-- MENU CATEGORIES (Phase 2 - Lower Priority)
-- =====================================================================================

CREATE TABLE public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurant_settings(id) ON DELETE CASCADE,
  
  -- Category Info
  name TEXT NOT NULL, -- z.B. "Hauptgerichte", "Getränke"
  description TEXT,
  icon_emoji TEXT, -- z.B. "🍔", "🥤"
  
  -- Display Configuration
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(restaurant_id, name)
);

-- Enable RLS
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies  
CREATE POLICY "Users can manage own menu categories" 
  ON public.menu_categories FOR ALL 
  USING (restaurant_id IN (
    SELECT id FROM public.restaurant_settings 
    WHERE profile_id = auth.uid()
  ));

-- Public read access for menu display
CREATE POLICY "Public can view active menu categories"
  ON public.menu_categories FOR SELECT
  USING (active = true);

-- =====================================================================================
-- MENU ITEMS (Phase 2 - Lower Priority)
-- =====================================================================================

CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  
  -- Item Info
  name TEXT NOT NULL, -- z.B. "Cevapcici im Fladenbrot (7Stk.)"
  description TEXT,
  
  -- Pricing (CHF)
  price_chf DECIMAL(6,2) CHECK (price_chf >= 0),
  
  -- Special Flags
  is_signature BOOLEAN DEFAULT false, -- Cevapcici Spezialitäten
  is_profitable BOOLEAN DEFAULT false, -- Mix-Gerichte mit höherer Marge
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  
  -- Availability
  available BOOLEAN DEFAULT true,
  sold_out BOOLEAN DEFAULT false,
  
  -- Display Configuration
  sort_order INTEGER DEFAULT 0,
  image_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own menu items" 
  ON public.menu_items FOR ALL 
  USING (category_id IN (
    SELECT c.id FROM public.menu_categories c
    JOIN public.restaurant_settings r ON c.restaurant_id = r.id
    WHERE r.profile_id = auth.uid()
  ));

-- Public read access for menu display
CREATE POLICY "Public can view available menu items"
  ON public.menu_items FOR SELECT
  USING (available = true AND category_id IN (
    SELECT id FROM public.menu_categories 
    WHERE active = true
  ));

-- =====================================================================================
-- TRIGGERS FOR AUTOMATIC PROFILE CREATION
-- =====================================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile with error handling
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================================
-- AUTOMATIC RESTAURANT SETTINGS CREATION
-- =====================================================================================

CREATE OR REPLACE FUNCTION public.create_default_restaurant_settings()
RETURNS TRIGGER AS $$
BEGIN
  -- Create restaurant settings with correct column name
  INSERT INTO public.restaurant_settings (profile_id, business_name)
  VALUES (NEW.id, 'Burgergrill Restaurant');
  
  -- Create default opening hours (7 days) with fixed SQL syntax
  WITH days AS (
    SELECT generate_series(0, 6) as day_of_week
  )
  INSERT INTO public.opening_hours (restaurant_id, day_of_week, is_closed, open_time, close_time)
  SELECT 
    rs.id,
    d.day_of_week,
    CASE 
      WHEN d.day_of_week = 6 THEN true  -- Sunday closed by default
      ELSE false 
    END as is_closed,
    CASE 
      WHEN d.day_of_week = 6 THEN NULL  -- Sunday
      ELSE '11:00'::TIME 
    END as open_time,
    CASE 
      WHEN d.day_of_week = 6 THEN NULL  -- Sunday  
      ELSE '22:00'::TIME 
    END as close_time
  FROM public.restaurant_settings rs 
  CROSS JOIN days d
  WHERE rs.profile_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for restaurant setup
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_default_restaurant_settings();

-- =====================================================================================
-- UTILITY FUNCTIONS
-- =====================================================================================

-- Function to get current opening status
CREATE OR REPLACE FUNCTION public.get_restaurant_status(restaurant_uuid UUID)
RETURNS TABLE(
  is_open BOOLEAN,
  current_message TEXT,
  next_opening TIME
) AS $$
DECLARE
  current_day INTEGER := EXTRACT(dow FROM CURRENT_DATE); -- 0=Sunday, adjust to our 0=Monday
  adjusted_day INTEGER := CASE WHEN current_day = 0 THEN 6 ELSE current_day - 1 END;
  current_time TIME := CURRENT_TIME;
BEGIN
  -- Check for special hours first
  IF EXISTS (
    SELECT 1 FROM public.special_hours 
    WHERE restaurant_id = restaurant_uuid 
    AND CURRENT_DATE BETWEEN date_start AND date_end
    AND show_banner = true
  ) THEN
    SELECT 
      NOT sh.is_closed as is_open,
      COALESCE(sh.custom_message, sh.reason) as current_message,
      sh.custom_open_time as next_opening
    INTO is_open, current_message, next_opening
    FROM public.special_hours sh
    WHERE sh.restaurant_id = restaurant_uuid 
    AND CURRENT_DATE BETWEEN sh.date_start AND sh.date_end
    AND sh.show_banner = true
    ORDER BY sh.banner_priority DESC
    LIMIT 1;
  ELSE
    -- Check regular opening hours
    SELECT 
      NOT oh.is_closed AND current_time BETWEEN oh.open_time AND oh.close_time as is_open,
      CASE 
        WHEN oh.is_closed THEN 'Heute geschlossen'
        WHEN current_time < oh.open_time THEN 'Öffnet um ' || oh.open_time::TEXT
        WHEN current_time > oh.close_time THEN 'Geschlossen'
        ELSE 'Geöffnet bis ' || oh.close_time::TEXT
      END as current_message,
      oh.open_time as next_opening
    INTO is_open, current_message, next_opening
    FROM public.opening_hours oh
    WHERE oh.restaurant_id = restaurant_uuid 
    AND oh.day_of_week = adjusted_day;
  END IF;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================================
-- STORAGE BUCKETS (for images)
-- =====================================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('restaurant-images', 'restaurant-images', true),
  ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Restaurant images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'restaurant-images');

CREATE POLICY "Menu images are publicly accessible"  
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

CREATE POLICY "Users can upload restaurant images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'restaurant-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload menu images"
  ON storage.objects FOR INSERT  
  WITH CHECK (bucket_id = 'menu-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================================================

CREATE INDEX idx_opening_hours_restaurant_day ON public.opening_hours(restaurant_id, day_of_week);
CREATE INDEX idx_special_hours_dates ON public.special_hours(restaurant_id, date_start, date_end);
CREATE INDEX idx_menu_items_category ON public.menu_items(category_id, sort_order);
CREATE INDEX idx_menu_categories_restaurant ON public.menu_categories(restaurant_id, sort_order);

-- =====================================================================================
-- TRIGGER FIXES APPLIED (2025-07-30)
-- =====================================================================================
-- ✅ handle_new_user(): Added error handling with ON CONFLICT and EXCEPTION blocks
-- ✅ create_default_restaurant_settings(): Fixed SQL syntax using CTE instead of 
--    generate_series in CASE statements to prevent PostgreSQL syntax errors
-- ✅ Both triggers now work reliably for automatic user onboarding

-- =====================================================================================
-- SCHEMA COMPLETE - Ready for Restaurant Business Logic
-- =====================================================================================