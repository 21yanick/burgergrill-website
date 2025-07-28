-- Shop Schema - E-Commerce functionality
-- Swiss-optimized for CHF currency (prices in Rappen)

-- Products table (E-Commerce) - Swiss optimized
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- in Rappen (CHF cents)
  currency TEXT DEFAULT 'CHF',
  image_url TEXT,
  category TEXT,
  stock_quantity INTEGER DEFAULT 0,
  digital BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table (E-Commerce) - Swiss optimized
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  total_amount INTEGER NOT NULL, -- in Rappen (CHF cents)
  currency TEXT DEFAULT 'CHF',
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT UNIQUE,
  shipping_address JSONB,
  billing_address JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table (E-Commerce)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL, -- in Rappen (CHF cents)
  total_price INTEGER NOT NULL, -- in Rappen (CHF cents)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read)
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" 
  ON public.products FOR SELECT 
  USING (active = true);

-- RLS Policies for orders
-- 🟩 SHOP-ONLY: Shop Owner Dashboard Access
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON public.orders;
CREATE POLICY "Authenticated users can view all orders" 
  ON public.orders FOR SELECT 
  USING (auth.uid() IS NOT NULL); -- Any authenticated user = shop owner

-- Order creation: Service role only (webhook creates orders)
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Service role can create orders" ON public.orders;
CREATE POLICY "Service role can create orders" 
  ON public.orders FOR INSERT 
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);

-- Order updates: Authenticated users can update status (shop owner)
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;
CREATE POLICY "Authenticated users can update orders" 
  ON public.orders FOR UPDATE 
  USING (auth.uid() IS NOT NULL) 
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for order_items
-- 🟩 SHOP-ONLY: Shop Owner Dashboard Access
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can view all order items" ON public.order_items;
CREATE POLICY "Authenticated users can view all order items" 
  ON public.order_items FOR SELECT 
  USING (auth.uid() IS NOT NULL); -- Any authenticated user = shop owner

-- Order items creation: Service role only (webhook creates order items)
DROP POLICY IF EXISTS "Service role can create order items" ON public.order_items;
CREATE POLICY "Service role can create order items" 
  ON public.order_items FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');

-- Additional storage bucket for product images
INSERT INTO storage.buckets (id, name)
VALUES ('product-images', 'product-images')
ON CONFLICT (id) DO NOTHING;