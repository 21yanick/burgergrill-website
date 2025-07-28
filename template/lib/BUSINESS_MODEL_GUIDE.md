# 🎯 Business Model Structure Guide

## ✅ SHARED (behalten für alle Models)
```
app/auth/                     # Authentication
app/(marketing)/features/     # Feature overview  
app/(marketing)/contact/      # Contact page
components/ui/                # Base UI components
components/auth/              # Auth components
components/layout/            # Navigation & layout
components/theme/             # Dark/light mode
lib/auth/                     # Auth logic
lib/supabase/                 # Database
lib/email/                    # Email system
lib/config.ts                 # Site config (teilweise)
```

## 🟦 SAAS-ONLY (löschen für Shop)
```
app/(marketing)/pricing/      # Pricing page
app/dashboard/subscription/   # Subscription management
app/api/subscription/         # Subscription APIs
components/billing/           # Billing components
lib/plans.ts                  # Plan definitions
lib/stripe/subscription.ts    # Subscription logic
```

## 🟩 SHOP-ONLY (löschen für SaaS)
```
app/(marketing)/shop/         # Product catalog (bereits vorhanden)
app/dashboard/orders/         # Order history (Platzhalter)
app/api/shop/                 # Shop APIs (Platzhalter)
components/shop/              # Shop components (Platzhalter)
lib/shop/                     # Shop logic (Platzhalter)
lib/stripe/shop.ts            # One-time payments (zu erstellen)
```

## Environment Variables

**🟦 SAAS-ONLY:**
```env
STRIPE_STARTER_PRICE_ID=price_xxx
STRIPE_PRO_PRICE_ID=price_xxx
```

**🟩 SHOP-ONLY:**
```env
STRIPE_PRODUCT_1_PRICE_ID=price_xxx
STRIPE_PRODUCT_2_PRICE_ID=price_xxx
```