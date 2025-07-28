# 📁 Template-Struktur

**NextJS 15 Template mit modernem Stack und flexibler Architektur**

Das Template ist standardmäßig als SaaS konfiguriert, aber so strukturiert, dass es einfach für andere Anwendungen umgebaut werden kann.

---

## 🎯 Template-Philosophie

**Ein sauberes, erweiterbares Template:**
- ✅ **Production-Ready**: Vollständig funktionsfähige Anwendung
- ✅ **Modern Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS
- ✅ **Swiss-Optimiert**: CHF, de-CH, Self-hosted
- ✅ **Flexibel**: SaaS Standard, aber einfach umgestaltbar
- ✅ **Modulare Struktur**: Components und Pages nach Bedarf

### Standard-Konfiguration

Das Template kommt mit folgender Standard-Einrichtung:

- **Anwendungstyp**: SaaS (Subscriptions)
- **Währung**: CHF (Schweizer Franken)
- **Sprache**: Deutsch (de-CH)
- **Payment**: Stripe mit TWINT Support
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL mit RLS

---

## 📂 Verzeichnis-Struktur

### Vollständige Template-Übersicht

```
template/
├── app/                        # Next.js 15 App Router
│   ├── (marketing)/           # Öffentliche Seiten (keine Auth erforderlich)
│   │   ├── layout.tsx         # Marketing Layout
│   │   ├── page.tsx           # Landing Page / Homepage
│   │   ├── features/          # Feature-Übersicht
│   │   │   └── page.tsx
│   │   ├── pricing/           # SaaS Pricing Pläne
│   │   │   └── page.tsx
│   │   ├── shop/              # Shop Seite (bereits vorhanden!)
│   │   │   └── page.tsx
│   │   └── contact/           # Kontakt-Seite
│   │       └── page.tsx
│   ├── auth/                  # Authentication Seiten
│   │   ├── login/             # Anmelde-Seite
│   │   │   └── page.tsx
│   │   ├── register/          # Registrierungs-Seite
│   │   │   └── page.tsx
│   │   ├── confirm/           # Email-Bestätigung
│   │   │   └── page.tsx
│   │   └── reset/             # Passwort zurücksetzen
│   │       └── page.tsx
│   ├── dashboard/             # Geschützte Bereiche (Auth erforderlich)
│   │   ├── layout.tsx         # Dashboard Layout
│   │   ├── page.tsx           # Haupt-Dashboard
│   │   └── subscription/      # SaaS Abonnement-Verwaltung
│   │       └── page.tsx
│   ├── api/                   # Backend API Routes
│   │   ├── health/            # Health Check
│   │   │   └── route.ts
│   │   ├── checkout/          # Stripe Checkout
│   │   │   └── route.ts
│   │   ├── subscription/      # Subscription Management
│   │   │   └── price-ids/
│   │   │       └── route.ts
│   │   └── webhooks/          # External Webhooks
│   │       └── stripe/
│   │           └── route.ts
│   ├── globals.css            # Global Styles
│   ├── layout.tsx             # Root Layout
│   ├── error.tsx              # Error Boundary
│   └── not-found.tsx          # 404 Page
├── components/                 # React Components
│   ├── ui/                    # Base UI Components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ...                # Weitere UI Components
│   ├── auth/                  # Authentication Components
│   │   ├── index.ts           # Barrel Export
│   │   ├── auth-button.tsx    # Login/Logout Button
│   │   ├── sign-in-form.tsx   # Anmelde-Formular
│   │   ├── sign-up-form.tsx   # Registrierungs-Formular
│   │   ├── sign-out-button.tsx
│   │   ├── reset-password-form.tsx
│   │   └── submit-button.tsx
│   ├── billing/               # SaaS Billing Components
│   │   ├── index.ts           # Barrel Export
│   │   ├── checkout-button.tsx # Stripe Checkout
│   │   ├── plan-comparison.tsx # Pricing Table
│   │   ├── plan-status.tsx    # Current Plan Display
│   │   ├── plan-actions.tsx   # Cancel/Resume Actions
│   │   └── billing-history.tsx # Invoice History
│   ├── layout/                # Layout Components
│   │   ├── index.ts           # Barrel Export
│   │   ├── header.tsx         # Navigation Header
│   │   ├── footer.tsx         # Page Footer
│   │   └── container.tsx      # Content Container
│   └── theme/                 # Theme System
│       ├── index.ts           # Barrel Export
│       ├── theme-provider.tsx # Theme Context
│       └── theme-toggle.tsx   # Dark/Light Toggle
├── hooks/                     # React Hooks
│   ├── use-user.ts           # Current User Hook
│   ├── use-profile.ts        # User Profile Hook
│   └── use-subscription.ts   # Subscription Data Hook
├── lib/                      # Utilities und Integrationen
│   ├── config.ts             # Zentrale Konfiguration
│   ├── plans.ts              # SaaS Plan-Definitionen
│   ├── utils.ts              # Helper Functions
│   ├── env.ts                # Environment Validation
│   ├── logger.ts             # Structured Logging
│   ├── auth/                 # Authentication Logic
│   │   ├── actions.ts        # Server Actions
│   │   └── server.ts         # Server-side Auth
│   ├── stripe/               # Payment Integration
│   │   ├── config.ts         # Stripe Configuration
│   │   └── subscription.ts   # Subscription Logic
│   ├── supabase/             # Database Integration
│   │   ├── client.ts         # Client-side
│   │   ├── server.ts         # Server-side
│   │   └── middleware.ts     # Middleware Helper
│   └── email/                # Email System
│       ├── client.ts         # Email Client (Resend)
│       └── templates/        # React Email Templates
│           ├── welcome.tsx   # Welcome Email
│           └── invoice.tsx   # Invoice Email
├── types/                    # TypeScript Definitions
│   ├── database.ts           # Database Types
│   └── env.d.ts              # Environment Types
├── .env.local                # Development Environment
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind Configuration
├── next.config.ts            # Next.js Configuration
├── tsconfig.json             # TypeScript Configuration
└── middleware.ts             # Route Protection
```

---

## 🧩 Component-Architektur

### UI Foundation (components/ui/)

Basiert auf **shadcn/ui** mit Radix UI Primitiven:

```typescript
// Beispiel: components/ui/button.tsx
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground...",
        // ...weitere Varianten
      }
    }
  }
)
```

**Verfügbare UI Components:**
- `Button` - Verschiedene Button-Varianten
- `Card` - Content Cards mit Header/Footer
- `Input` - Form Input Fields
- `DropdownMenu` - Context Menus
- `Avatar` - User Avatars
- `Badge` - Status Badges
- `Separator` - Visual Dividers

### Authentication System (components/auth/)

**Vollständiges Auth-System:**

```typescript
// components/auth/auth-button.tsx
export function AuthButton() {
  const user = useUser()
  
  if (user) {
    return <SignOutButton />
  }
  
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" asChild>
        <Link href="/auth/login">Anmelden</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/register">Registrieren</Link>
      </Button>
    </div>
  )
}
```

**Auth Components:**
- `AuthButton` - Smart Login/Logout Button
- `SignInForm` - Email/Password Login
- `SignUpForm` - User Registration
- `ResetPasswordForm` - Password Reset
- `SubmitButton` - Loading State Button

### SaaS Billing System (components/billing/)

**Subscription Management:**

```typescript
// components/billing/plan-comparison.tsx
export function PlanComparison() {
  const plans = getPlansWithPriceIds()
  
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <Card key={plan.id} className={cn(
          "relative",
          plan.popular && "border-primary shadow-lg"
        )}>
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <div className="text-3xl font-bold">
              {formatSwissPrice(plan.price)}
              <span className="text-sm text-muted-foreground">/Monat</span>
            </div>
          </CardHeader>
          <CardContent>
            <CheckoutButton priceId={plan.id} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

**Billing Components:**
- `PlanComparison` - Pricing Table
- `CheckoutButton` - Stripe Checkout Integration
- `PlanStatus` - Current Subscription Display
- `PlanActions` - Cancel/Resume Buttons
- `BillingHistory` - Invoice List

### Layout System (components/layout/)

**Konsistente Navigation:**

```typescript
// components/layout/header.tsx
export function Header() {
  const navigationLinks = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' }
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">{siteConfig.name}</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
            <AuthButton />
          </nav>
        </div>
      </Container>
    </header>
  )
}
```

---

## ⚙️ Konfiguration und Setup

### Zentrale Konfiguration (lib/config.ts)

**Single Source of Truth:**

```typescript
export const siteConfig = {
  // Branding - wird in 100% der Projekte angepasst
  name: "SaaS Starter",
  description: "100% self-hosted SaaS starter kit...",
  
  // Regional Settings - für schweizer Markt optimiert  
  currency: "CHF" as const,
  region: "swiss" as const,
  locale: "de-CH" as const,
  
  // Business Settings
  pricing: {
    starter: 9.90,
    pro: 19.90
  },
  
  // Contact Information
  contact: {
    email: "support@yourcompany.com",
    company: "Your Company Name"
  }
} as const
```

### Plan-System (lib/plans.ts)

**SaaS Pricing Struktur:**

```typescript
export const PLANS: Record<PlanType, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Für erste Schritte und Testen',
    price: 0,
    features: [
      'Bis zu 1 Benutzer',
      'Basis Features',
      'Community Support'
    ]
  },
  starter: {
    id: 'starter', 
    name: 'Starter',
    price: siteConfig.pricing.starter,
    features: [
      'Bis zu 5 Benutzer',
      'Alle Basis Features', 
      'E-Mail Support'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro', 
    price: siteConfig.pricing.pro,
    features: [
      'Bis zu 25 Benutzer',
      'Priority Support',
      'API Zugang'
    ]
  }
}
```

### Environment Setup (.env.local)

**Bereits konfigurierte Entwicklungsumgebung:**

```env
# Supabase (Infrastructure Integration)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:55321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Stripe (Test Keys - ersetzen für Production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
LOG_LEVEL=info
```

---

## 🛠️ Template-Anpassung

### SaaS → Shop Umbau

**Praktische Schritte für Shop-Anwendung:**

1. **Navigation anpassen:**
```typescript
// components/layout/header.tsx
const navigationLinks = [
  { href: '/shop', label: 'Shop' },          // ← /pricing ersetzen
  { href: '/features', label: 'Produkte' },  // ← anpassen  
  { href: '/contact', label: 'Kontakt' }
]
```

2. **Dashboard umbauen:**
```bash
# Subscription entfernen
rm -rf app/dashboard/subscription/

# Shop Dashboard erstellen
mkdir app/dashboard/orders/
# components/billing/ → components/shop/ kopieren
```

3. **Schema aktivieren:**
```sql
-- infrastructure/volumes/db/business-schema.sql
\i 01-saas-schema.sql    -- auskommentieren
\i 02-shop-schema.sql    -- aktivieren
```

### Custom Branding

**Logo und Farben:**

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#your-brand-color',  // ← anpassen
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

```typescript  
// lib/config.ts
export const siteConfig = {
  name: "Ihr Unternehmen",              // ← anpassen
  description: "Ihre Beschreibung...",   // ← anpassen
  contact: {
    email: "info@ihrunternehmen.ch",    // ← anpassen
    company: "Ihr Unternehmen GmbH"     // ← anpassen
  }
}
```

### Neue Features hinzufügen

**Component erstellen:**

```bash
# Neue Feature-Komponente
mkdir components/your-feature/
touch components/your-feature/index.ts
touch components/your-feature/your-component.tsx

# Barrel Export
echo "export { YourComponent } from './your-component'" >> components/your-feature/index.ts
```

**Page hinzufügen:**

```bash
# Neue Seite
mkdir app/your-page/
touch app/your-page/page.tsx
```

**API Route hinzufügen:**

```bash
# Neue API
mkdir app/api/your-endpoint/
touch app/api/your-endpoint/route.ts
```

---

## 🔧 Development Workflow

### Live Development

```bash
# 1. Infrastructure starten
cd infrastructure/
docker compose up -d

# 2. Template Development
cd template/
pnpm install
pnpm run dev

# → Live Reload auf http://localhost:3000
# → Änderungen sind sofort sichtbar
```

### Component Development

```typescript
// Neue Component mit TypeScript
export interface YourComponentProps {
  title: string
  description?: string
}

export function YourComponent({ title, description }: YourComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
    </Card>
  )
}
```

### Testing und Quality

```bash
# Code Quality
pnpm run lint        # ESLint prüfung
pnpm run type-check  # TypeScript validation
pnpm run format      # Prettier formatting

# Build Test
pnpm run build       # Production build test
```

---

## 📦 Template-Features

### Bereits implementiert

**Authentication:**
- ✅ Email/Password Registrierung
- ✅ Login/Logout Flow
- ✅ Password Reset
- ✅ Email Bestätigung
- ✅ Protected Routes

**SaaS Features:**
- ✅ Subscription Management
- ✅ Stripe Integration (CHF)
- ✅ Plan Comparison Table
- ✅ Billing History
- ✅ Webhook Handling

**UI/UX:**
- ✅ Dark/Light Theme
- ✅ Responsive Design
- ✅ Modern Component Library
- ✅ Loading States
- ✅ Error Handling

**Swiss Optimization:**
- ✅ CHF Währung
- ✅ Deutsche Sprache (de-CH)
- ✅ TWINT Payment Support
- ✅ Swiss Number/Date Formatting

### Einfach erweiterbar

**Shop Features:**
- 🔄 Product Catalog (Schema vorhanden)
- 🔄 Shopping Cart
- 🔄 Order Management
- 🔄 Shop Page (bereits erstellt!)

**Booking Features:**
- 🔄 Appointment Calendar (Schema vorhanden) 
- 🔄 Service Management
- 🔄 Availability System
- 🔄 Calendar Integration

---

## 🎯 Best Practices

### Code Organization

```bash
# Gruppierung nach Domäne
components/
├── auth/           # Authentication-bezogen
├── billing/        # SaaS-bezogen  
├── shop/           # E-Commerce-bezogen (bei Bedarf)
└── ui/             # Base Components

# Barrel Exports für saubere Imports
import { SignInForm, AuthButton } from '@/components/auth'
import { PlanComparison, CheckoutButton } from '@/components/billing'
```

### TypeScript Integration

```typescript
// Strikte Type Safety
import type { Database } from '@/types/database'
import type { SiteConfig } from '@/lib/config'

// Props mit TypeScript
interface ComponentProps {
  user: Database['public']['Tables']['profiles']['Row']
  config: SiteConfig
}
```

### Performance Optimization

```typescript
// Server Components by default
export default function Page() {
  return <ServerComponent />
}

// Client Components nur bei Bedarf
'use client'
export function InteractiveComponent() {
  const [state, setState] = useState()
  return <ClientComponent />
}
```

---

**Template-Status:** Production-Ready ✅  
**Framework:** Next.js 15 + React 19 ✅  
**Flexibilität:** SaaS/Shop/Booking ✅