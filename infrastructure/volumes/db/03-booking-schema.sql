-- Booking Schema - Appointment scheduling functionality
-- Swiss-optimized for CHF currency and Europe/Zurich timezone

-- Appointments table (Booking Systems) - Swiss optimized
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price INTEGER, -- in Rappen (CHF cents)
  currency TEXT DEFAULT 'CHF',
  status TEXT DEFAULT 'booked',
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for appointments
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
CREATE POLICY "Users can view own appointments" 
  ON public.appointments FOR SELECT 
  USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can create appointments" ON public.appointments;
CREATE POLICY "Users can create appointments" 
  ON public.appointments FOR INSERT 
  WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can update own appointments" ON public.appointments;
CREATE POLICY "Users can update own appointments" 
  ON public.appointments FOR UPDATE 
  USING (auth.uid() = customer_id);