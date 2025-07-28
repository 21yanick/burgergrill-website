# 🎨 Starter Kit Customization Guide

**Transform your NextJS starter kit: SaaS ↔ Shop ↔ Custom in minutes**

This guide shows you how to convert between business models using our production-ready, dual-mode starter kit.

---

## 🚀 Quick Start: 3-Step Conversion

### SaaS → Shop (3 minutes)

```bash
# 1. Remove SaaS-specific code
rm -rf app/\(marketing\)/pricing/
rm -rf app/dashboard/subscription/
rm -rf components/billing/
rm lib/plans.ts

# 2. Update navigation (1 line change)
# In components/layout/header.tsx, change:
# { href: '/pricing', label: 'Pricing' }    # to:
# { href: '/shop', label: 'Shop' }

# 3. Done! Shop is already functional
npm run dev
# → Open /shop to see your working e-commerce store
```

### Shop → SaaS (reverse process)

```bash
# 1. Restore SaaS components (git checkout or copy from backups)
git checkout HEAD -- app/\(marketing\)/pricing/
git checkout HEAD -- app/dashboard/subscription/
git checkout HEAD -- components/billing/
git checkout HEAD -- lib/plans.ts

# 2. Update navigation back to pricing
# 3. Done! SaaS is ready
```

**Why so simple?** Our starter kit runs **both systems simultaneously** with clean separation. No database migration needed!

---

## 🏗️ Architecture: Dual-Mode Design

### Self-Explanatory Structure

```typescript
template/
├── app/
│   ├── (marketing)/
│   │   ├── pricing/           // 🟦 SAAS-ONLY
│   │   └── shop/              // 🟩 SHOP-ONLY
│   ├── dashboard/
│   │   ├── subscription/      // 🟦 SAAS-ONLY  
│   │   └── orders/            // 🟩 SHOP-ONLY
│   └── api/
│       └── webhooks/stripe/   // ✅ SHARED (handles both)
├── components/
│   ├── billing/               // 🟦 SAAS-ONLY
│   ├── shop/                  // 🟩 SHOP-ONLY
│   └── ui/                    // ✅ SHARED
└── lib/
    ├── plans.ts               // 🟦 SAAS-ONLY
    ├── shop/                  // 🟩 SHOP-ONLY
    ├── email/templates/       // ✅ SHARED (both models)
    └── config.ts              // ✅ SHARED
```

### Key Principles

- **✅ No Feature Flags**: Separate files for each business model
- **✅ Self-Explanatory**: Comments show SHARED vs BUSINESS-SPECIFIC
- **✅ Copy-Paste Ready**: All examples work out of the box
- **✅ Swiss-Optimized**: CHF, TWINT, de-CH throughout
- **✅ Modern Stack**: NextJS 15, Server Actions, TypeScript, Zustand

---

## 🛍️ Shop System Reference

### Complete E-Commerce Flow

Our shop implementation is **production-ready** with:

```yaml
✅ Cart System: Zustand + persist, real-time updates
✅ Checkout: Server Actions, CHF + TWINT, guest checkout  
✅ Order Management: Dashboard, status updates, Swiss formatting
✅ Email System: Order confirmation + status updates
✅ Payment Processing: Stripe hosted, webhook-driven persistence
✅ Address Collection: Smart digital/physical product detection
```

### 1. Product Catalog

```typescript
// lib/shop/products.ts - Real implementation
export const products: Product[] = [
  {
    id: 'premium-tshirt',
    name: 'Premium T-Shirt',
    description: 'Hochwertiges T-Shirt aus Bio-Baumwolle',
    price: 2490, // 24.90 CHF in Rappen
    currency: 'CHF',
    digital: false, // Physical product = shipping required
    stripe_price_id: 'price_1RmVHYEFwSnkmysmWsfWDbWe',
    image_url: '/images/products/t-shirt-premium.svg'
  },
  {
    id: 'digital-guide',
    name: 'Digital Style Guide',
    description: 'PDF-Leitfaden für modernes Design',
    price: 1990, // 19.90 CHF
    currency: 'CHF', 
    digital: true, // Digital product = no shipping
    stripe_price_id: 'price_1RmVLsEFwSnkmysmQS17NN4y',
    image_url: '/images/products/guide-digital.svg'
  }
]
```

### 2. Shopping Cart (Zustand + Persist)

```typescript
// lib/shop/cart-store.ts - Production-ready state management
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  // Computed functions (not getters to avoid infinite loops)
  getItemCount: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product) => set((state) => {
        const existingItem = state.items.find(item => item.product.id === product.id)
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          }
        }
        return { items: [...state.items, { product, quantity: 1 }] }
      }),
      
      // ... other methods
      
      getItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotal: () => get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    }),
    { name: 'shopping-cart' }
  )
)
```

### 3. Checkout (Server Actions)

```typescript
// lib/shop/checkout-actions.ts - Modern NextJS 15 pattern
'use server'

import { stripe } from '@/lib/stripe/config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createCheckoutSession(cartItems: CartItem[]) {
  // Detect if shipping is needed (KISS approach)
  const needsShipping = cartItems.some(item => !item.product.digital)
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment', // One-time payment (not subscription)
    payment_method_types: ['card', 'twint'],
    currency: 'chf',
    
    line_items: cartItems.map(item => ({
      price: item.product.stripe_price_id,
      quantity: item.quantity,
    })),
    
    // Conditional shipping collection
    ...(needsShipping && {
      shipping_address_collection: { allowed_countries: ['CH'] },
    }),
    
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop`,
  })
  
  redirect(session.url!)
}
```

### 4. Order Management Dashboard

```typescript
// app/dashboard/orders/page.tsx - Server Component
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function OrdersPage() {
  const supabase = createServerClient(/* config */)
  
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id, product_name, quantity, unit_price, total_price
      )
    `)
    .order('created_at', { ascending: false })
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bestellungen</h1>
      
      <div className="grid gap-4">
        {orders?.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
```

### 5. Email System (Swiss-Optimized)

```typescript
// lib/email/templates/order-confirmation.tsx
export function OrderConfirmationEmail({
  customerEmail,
  orderId,
  orderItems,
  totalAmount,
  hasShipping,
  shippingAddress
}: OrderConfirmationEmailProps) {
  const formattedTotal = new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(totalAmount / 100)

  return (
    <Html>
      <Head />
      <Preview>Bestellbestätigung - {formattedTotal}</Preview>
      <Body>
        <Container>
          <Heading>Bestellung erfolgreich!</Heading>
          <Text>
            Vielen Dank für Ihre Bestellung #{orderId.slice(-8)}.
          </Text>
          
          {/* Order items, shipping, etc. */}
          
        </Container>
      </Body>
    </Html>
  )
}
```

**Email Integration (Webhook):**

```typescript
// app/api/webhooks/stripe/route.ts - KISS email sending
case 'checkout.session.completed': {
  // ... create order in database
  
  // Send confirmation email
  if (session.customer_details?.email) {
    await resend.emails.send({
      from: `Shop <noreply@${process.env.EMAIL_DOMAIN}>`,
      to: session.customer_details.email,
      subject: `Bestellbestätigung #${order.id.slice(-8)}`,
      react: OrderConfirmationEmail({ /* props */ }),
    })
  }
  break
}
```

---

## 💼 SaaS System Reference

### Subscription Management

```typescript
// components/billing/plan-comparison.tsx
export function PlanComparison() {
  const plans = [
    {
      name: 'Starter',
      price: 2990, // 29.90 CHF
      features: ['5 Projekte', 'Email Support'],
      stripe_price_id: 'price_starter_monthly'
    },
    {
      name: 'Pro',
      price: 7990, // 79.90 CHF  
      features: ['Unbegrenzte Projekte', 'Priority Support'],
      stripe_price_id: 'price_pro_monthly'
    }
  ]
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {plans.map((plan) => (
        <PlanCard key={plan.name} plan={plan} />
      ))}
    </div>
  )
}
```

### Subscription Checkout

```typescript
// components/billing/checkout-button.tsx
export function CheckoutButton({ priceId }: { priceId: string }) {
  const handleCheckout = async () => {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // Recurring payment
      payment_method_types: ['card', 'twint'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    })
    
    window.location.href = session.url!
  }
  
  return (
    <Button onClick={handleCheckout}>
      Jetzt abonnieren
    </Button>
  )
}
```

---

## 🌐 Production Setup

### 1. Environment Configuration

```bash
# .env.local - Production setup
NEXT_PUBLIC_APP_URL=https://yourdomain.ch
EMAIL_DOMAIN=yourdomain.ch

# Stripe (use live keys in production)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (for emails)
RESEND_API_KEY=re_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 2. Email Setup (Resend)

**Domain Configuration:**
```dns
# Add these DNS records to yourdomain.ch
TXT   @     "v=spf1 include:_spf.resend.com ~all"
CNAME resend._domainkey  resend._domainkey.resend.com
```

**Test Email Sending:**
```typescript
// Test in development
import { resend } from '@/lib/email/client'
import { OrderConfirmationEmail } from '@/lib/email/templates'

await resend.emails.send({
  from: 'Shop <shop@yourdomain.ch>',
  to: 'test@example.com',
  subject: 'Test Email',
  react: OrderConfirmationEmail({
    customerEmail: 'test@example.com',
    orderId: 'test-order-123',
    orderItems: [],
    totalAmount: 2490,
    orderDate: new Date().toISOString(),
    hasShipping: false,
  }),
})
```

### 3. Database Setup

**Our starter kit includes both schemas by default:**

```sql
-- infrastructure/volumes/db/02-shop-schema.sql
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- in Rappen (CHF cents)
  currency TEXT DEFAULT 'CHF',
  digital BOOLEAN DEFAULT false,
  stripe_price_id TEXT UNIQUE,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  total_amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'CHF',
  shipping_address JSONB,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ... order_items table and RLS policies
```

**No migration needed!** Both SaaS and Shop schemas coexist.

### 4. Stripe Configuration

**Products Setup (one-time):**
```bash
# Create products in Stripe Dashboard or via CLI
stripe products create --name "Premium T-Shirt" --description "Bio-Baumwolle"
stripe prices create --product prod_xxx --currency chf --unit-amount 2490

# For SaaS subscriptions
stripe prices create --product prod_yyy --currency chf --unit-amount 2990 --recurring-interval month
```

**Webhook Setup:**
```bash
# Add webhook endpoint in Stripe Dashboard:
# URL: https://yourdomain.ch/api/webhooks/stripe
# Events: checkout.session.completed, customer.subscription.created, customer.subscription.updated
```

---

## 🎨 Branding & Customization

### 1. Visual Identity

```typescript
// lib/config.ts - Central configuration
export const siteConfig = {
  name: "Ihr Unternehmen",
  description: "Professionelle Schweizer Lösung für...",
  
  // Regional Settings (Swiss optimized)
  currency: "CHF" as const,
  region: "swiss" as const,
  locale: "de-CH" as const,
  
  // Contact Information
  contact: {
    email: "info@ihrunternehmen.ch",
    company: "Ihr Unternehmen GmbH",
    phone: "+41 44 123 45 67",
    address: "Bahnhofstrasse 1, 8001 Zürich"
  },
  
  // Social Media
  social: {
    twitter: "https://twitter.com/ihrunternehmen",
    linkedin: "https://linkedin.com/company/ihrunternehmen"
  }
} as const
```

### 2. Theme Customization

```typescript
// tailwind.config.ts - Brand colors
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',  // Your main brand color
          600: '#0284c7',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
      }
    }
  }
}
```

### 3. Logo & Assets

```bash
# Replace logo files
template/public/logo.svg          # Header logo
template/public/favicon.ico       # Browser favicon
template/public/apple-icon.png    # Mobile icon

# Product images (optional upgrade from SVG placeholders)
template/public/images/products/
├── product-1.jpg                 # 400x400px, <50KB
├── product-2.jpg
└── ...
```

---

## 🔧 Advanced Customization

### Custom Business Logic

**1. Add Custom Database Tables:**

```sql
-- infrastructure/volumes/db/04-custom-schema.sql
CREATE TABLE IF NOT EXISTS public.custom_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  feature_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.custom_features ENABLE ROW LEVEL SECURITY;

-- User-specific policy
CREATE POLICY "Users can manage own features" 
  ON public.custom_features 
  FOR ALL USING (auth.uid() = user_id);
```

**2. Custom API Routes:**

```typescript
// app/api/custom/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const supabase = createClient()
  const { data } = await supabase
    .from('custom_features')
    .select('*')
    .eq('user_id', user.id)
  
  return NextResponse.json({ data })
}
```

**3. Custom Components:**

```typescript
// components/custom/feature.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CustomFeature() {
  const [data, setData] = useState([])
  
  useEffect(() => {
    fetch('/api/custom')
      .then(res => res.json())
      .then(result => setData(result.data || []))
  }, [])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Feature</CardTitle>
      </CardHeader>
      <CardContent>
        {data.map((item) => (
          <div key={item.id}>
            {/* Your custom UI */}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
```

---

## 📋 Conversion Checklist

### SaaS → Shop Migration

- [ ] **Remove SaaS Code**
  - [ ] Delete `/pricing`, `/subscription`, `/billing` directories
  - [ ] Remove `lib/plans.ts`
  - [ ] Clean up unused imports

- [ ] **Update Navigation**
  - [ ] Change header navigation `/pricing` → `/shop`
  - [ ] Update dashboard navigation
  - [ ] Test all navigation links

- [ ] **Configure Products**
  - [ ] Add products to `lib/shop/products.ts`
  - [ ] Set up Stripe price IDs in `.env.local`
  - [ ] Add product images to `/public/images/products/`

- [ ] **Test Shop Flow**
  - [ ] Browse products at `/shop`
  - [ ] Add items to cart
  - [ ] Complete checkout process
  - [ ] Verify order creation
  - [ ] Test email notifications

- [ ] **Production Setup**
  - [ ] Configure email domain (Resend)
  - [ ] Set up Stripe webhooks
  - [ ] Test with live Stripe keys
  - [ ] Verify SSL certificate

### Shop → SaaS Migration

- [ ] **Restore SaaS Code**
  - [ ] Restore pricing, subscription, billing components
  - [ ] Add back `lib/plans.ts`
  - [ ] Update imports

- [ ] **Update Navigation**
  - [ ] Change header navigation `/shop` → `/pricing`
  - [ ] Test subscription flow

- [ ] **Test SaaS Flow**
  - [ ] Browse plans at `/pricing`
  - [ ] Complete subscription checkout
  - [ ] Verify subscription creation
  - [ ] Test billing dashboard

---

## 🎯 Best Practices

### Code Organization

```bash
# Keep business-specific code separated
components/
├── ui/              # ✅ SHARED - Use everywhere
├── auth/            # ✅ SHARED - Universal auth
├── shop/            # 🟩 SHOP-ONLY - Delete for SaaS
├── billing/         # 🟦 SAAS-ONLY - Delete for Shop
└── custom/          # 🎨 YOUR-SPECIFIC - Custom features

lib/
├── config.ts        # ✅ SHARED - Main configuration
├── shop/            # 🟩 SHOP-ONLY
├── plans.ts         # 🟦 SAAS-ONLY
└── custom/          # 🎨 YOUR-SPECIFIC
```

### Version Control Strategy

```bash
# Branch strategy for customizations
main                    # Clean starter kit base
feature/branding       # Visual identity changes
feature/shop-system    # Shop-specific features  
feature/custom-logic   # Your business logic
production            # Deployed version

# Keep customizations modular
git checkout -b feature/your-custom-feature
# Make changes in isolated components
git commit -m "Add custom feature X"
```

### Performance Optimization

```typescript
// Lazy load business-specific components
const ShopComponents = dynamic(() => import('@/components/shop'), {
  loading: () => <div>Loading shop...</div>
})

const BillingComponents = dynamic(() => import('@/components/billing'), {
  loading: () => <div>Loading billing...</div>
})
```

### Monitoring & Analytics

```typescript
// lib/analytics.ts - Track business model usage
export function trackConversion(model: 'saas' | 'shop', event: string) {
  // Your analytics implementation
  analytics.track(`${model}_${event}`, {
    timestamp: new Date().toISOString(),
    model,
    event
  })
}

// Usage in components
trackConversion('shop', 'purchase_completed')
trackConversion('saas', 'subscription_created')
```

---

## 🚀 Success Criteria

### Technical Excellence
- ✅ **Clean Separation**: No business model code mixing
- ✅ **Type Safety**: Complete TypeScript coverage
- ✅ **Performance**: <3s load time, optimized bundles
- ✅ **Mobile Ready**: Responsive design, touch-friendly
- ✅ **Accessibility**: WCAG 2.1 AA compliance

### Swiss Standards
- ✅ **Currency**: CHF formatting throughout
- ✅ **Payments**: TWINT + major cards supported
- ✅ **Language**: German content, de-CH locale
- ✅ **Legal**: Swiss address format, postal codes
- ✅ **UX**: Swiss user expectations met

### Production Ready
- ✅ **Security**: RLS policies, input validation
- ✅ **Reliability**: Error handling, graceful degradation
- ✅ **Scalability**: Database design, caching strategy
- ✅ **Monitoring**: Logging, error tracking
- ✅ **Documentation**: Complete setup guides

---

**🎉 Your starter kit is now ready for any business model!**

Need help? Check our [GitHub issues](https://github.com/your-repo/issues) or reach out to our support team.