# 🔗 Service-Integrationen

**Production-ready Services mit schweizer Optimierung**

Das Template integriert bewährte Services für Authentication, Payments, Email und Monitoring - alle optimiert für den Schweizer Markt.

---

## 🎯 Service-Übersicht

| Service | Zweck | Integration | Swiss Features |
|---------|-------|-------------|----------------|
| **Supabase** | Database + Auth | Selbst-gehostet | Europe/Zurich, DSGVO |
| **Stripe** | Payments | CHF Optimiert | TWINT, CHF, Swiss Business |
| **Resend** | Email | German Templates | de-CH Formatierung |
| **Sentry** | Error Tracking | DSGVO Compliant | EU Data Residency |
| **Pino** | Logging | Structured | German Timezone |

### Standard-Konfiguration

Das Template ist standardmäßig für **SaaS Subscriptions** konfiguriert:

- **Payments**: Stripe Subscriptions mit CHF
- **Authentication**: Supabase Auth System
- **Email**: Resend für Billing Notifications
- **Database**: Self-hosted PostgreSQL
- **Monitoring**: Sentry + Structured Logging

---

## 💳 Stripe Payment Integration

### SaaS Subscription System

**CHF-optimierte Subscription-Verwaltung:**

```typescript
// lib/stripe/config.ts
export const SUBSCRIPTION_PRICES = {
  starter: process.env.STRIPE_STARTER_PRICE_ID!,
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
} as const

// Swiss Payment Configuration
export const SWISS_SAAS_CONFIG = {
  region: 'swiss',
  paymentMethods: ['card', 'twint'],
  currency: 'CHF',
  subscriptions: true, // Always enabled for SaaS
} as const
```

### Checkout Integration

**Subscription Checkout Flow:**

```typescript
// lib/stripe/subscription.ts
export async function createSubscriptionCheckout({
  priceId,
  trialDays,
  metadata = {},
}: CreateSubscriptionCheckoutOptions) {
  const user = await getUser()
  if (!user?.email) throw new Error('User not authenticated')

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer_email: user.email,
    mode: 'subscription',
    payment_method_types: ['card', 'twint'],
    line_items: [
      {
        price: SUBSCRIPTION_PRICES[priceId],
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      userId: user.id,
      businessModel: 'saas',
      plan: priceId,
      ...metadata,
    },
  }

  const session = await stripe.checkout.sessions.create(sessionParams)
  return session
}
```

### Webhook Integration

**Automatische Subscription Synchronisation:**

```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(request: Request) {
  const signature = headers().get('stripe-signature');
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription
      
      // Database synchronization
      await supabase.from('subscriptions').upsert({
        stripe_subscription_id: subscription.id,
        stripe_price_id: subscription.items.data[0].price.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
        // Swiss-specific metadata
        currency: 'CHF',
        region: 'swiss'
      })
      break
      
    case 'invoice.payment_succeeded':
      // Send payment confirmation email
      await sendBillingEmail(subscription.customer)
      break
  }
}
```

### Swiss Payment Methods

**TWINT Integration:**

```typescript
// Schweizer Payment Methods
export function getSwissPaymentMethods() {
  return ['card', 'twint'] // TWINT for Swiss customers
}

// CHF Pricing with Rappen handling
export function formatSwissPrice(price: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}
```

---

## 🔐 Supabase Authentication

### Self-hosted Auth System

**Vollständiges Authentication System:**

```typescript
// lib/auth/server.ts
export async function getUser(): Promise<User | null> {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Auth error:', error)
    return null
  }
  
  return user
}

export async function getProfile(userId: string) {
  const supabase = createClient()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
    
  if (error) throw error
  return profile
}
```

### Database Integration

**PostgreSQL mit Row Level Security:**

```sql
-- Profiles table with RLS
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);
```

### Client-Side Integration

**React Hooks für Authentication:**

```typescript
// hooks/use-user.ts
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const supabase = createClient()
    
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )
    
    return () => subscription.unsubscribe()
  }, [])
  
  return { user, loading }
}
```

### Route Protection

**Middleware für geschützte Routen:**

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createMiddlewareClient({ req: request, res: response })
  const { data: { session } } = await supabase.auth.getSession()

  // Protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Auth redirects for logged-in users
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}
```

---

## 📧 Email System (Resend)

### German Email Templates

**React Email mit deutscher Lokalisierung:**

```typescript
// lib/email/templates/welcome.tsx
import { Html, Head, Preview, Body, Container, Section, Text, Button } from '@react-email/components'

interface WelcomeEmailProps {
  userName: string
  confirmUrl: string
}

export function WelcomeEmail({ userName, confirmUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Willkommen bei {siteConfig.name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={heading}>
              Hallo {userName}, willkommen!
            </Text>
            <Text style={paragraph}>
              Vielen Dank für Ihre Registrierung bei {siteConfig.name}. 
              Bestätigen Sie Ihre E-Mail-Adresse, um zu beginnen.
            </Text>
            <Button href={confirmUrl} style={button}>
              E-Mail bestätigen
            </Button>
            <Text style={footer}>
              Bei Fragen erreichen Sie uns unter {siteConfig.contact.email}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
```

### Billing Email Integration

**Invoice Notifications:**

```typescript
// lib/email/templates/invoice.tsx
export function InvoiceEmail({ 
  customerName, 
  invoiceNumber, 
  amount, 
  dueDate 
}: InvoiceEmailProps) {
  const formattedAmount = new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF'
  }).format(amount / 100)

  const formattedDate = new Intl.DateTimeFormat('de-CH', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  }).format(new Date(dueDate))

  return (
    <Html>
      <Body>
        <Container>
          <Text>Hallo {customerName},</Text>
          <Text>
            Ihre Rechnung #{invoiceNumber} über {formattedAmount} 
            ist am {formattedDate} fällig.
          </Text>
          <Text>
            Mit freundlichen Grüssen,<br/>
            {siteConfig.contact.company}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

### Email Client Setup

**Resend Integration:**

```typescript
// lib/email/client.ts
import { Resend } from 'resend'
import { WelcomeEmail } from './templates/welcome'
import { InvoiceEmail } from './templates/invoice'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(
  email: string, 
  userName: string, 
  confirmUrl: string
) {
  return await resend.emails.send({
    from: `${siteConfig.name} <noreply@${process.env.EMAIL_DOMAIN}>`,
    to: email,
    subject: `Willkommen bei ${siteConfig.name}`,
    react: WelcomeEmail({ userName, confirmUrl }),
  })
}

export async function sendBillingEmail(customerId: string) {
  // Get customer data and send invoice email
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('stripe_customer_id', customerId)
    .single()
    
  if (!profile) return
  
  return await resend.emails.send({
    from: `Billing <billing@${process.env.EMAIL_DOMAIN}>`,
    to: profile.email,
    subject: 'Rechnung bezahlt - Vielen Dank',
    react: InvoiceEmail({
      customerName: profile.full_name,
      // ... invoice details
    }),
  })
}
```

---

## ⚙️ Environment Konfiguration

### Development Setup

**Template `.env.local` (bereits konfiguriert):**

```env
# Supabase Integration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:55321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Database Connection  
DATABASE_URL=postgresql://postgres:your-super-secret-and-long-postgres-password@localhost:5432/postgres

# Stripe Integration (Test Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
LOG_LEVEL=info

# Email Service
RESEND_API_KEY=re_YOUR_API_KEY_HERE

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_SENTRY_DSN_HERE
SENTRY_AUTH_TOKEN=YOUR_SENTRY_AUTH_TOKEN_HERE
```

### Production Environment

**Live Konfiguration:**

```env
# Production Supabase (oder eigene PostgreSQL)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Live Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...

# Production URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.ch
EMAIL_DOMAIN=yourdomain.ch

# Live Services
RESEND_API_KEY=re_live_...
NEXT_PUBLIC_SENTRY_DSN=https://production-sentry-dsn...
```

### Environment Validation

**Type-Safe Environment mit Zod:**

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  STRIPE_STARTER_PRICE_ID: z.string().startsWith('price_'),
  STRIPE_PRO_PRICE_ID: z.string().startsWith('price_'),
  
  // Application
  NEXT_PUBLIC_APP_URL: z.string().url(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  
  // Optional Services
  RESEND_API_KEY: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
})

export const env = envSchema.parse(process.env)
```

---

## 📊 Monitoring & Analytics

### Structured Logging

**Pino Logger Integration:**

```typescript
// lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  },
})

// Usage in API routes
export function getLogger(context: string) {
  return logger.child({ context })
}

// Example usage
const apiLogger = getLogger('stripe-webhook')
apiLogger.info('Processing webhook', { 
  event_type: event.type,
  customer_id: event.data.object.customer 
})
```

### Error Tracking

**Sentry Integration:**

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: false,
})

// app/error.tsx
'use client'
import * as Sentry from '@sentry/nextjs'

export default function GlobalError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }
  reset: () => void
}) {
  Sentry.captureException(error)
  
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Ein Fehler ist aufgetreten
            </h1>
            <button onClick={reset} className="btn-primary">
              Erneut versuchen
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
```

### Analytics Integration

**Subscription Analytics:**

```typescript
// Track subscription events
export async function trackSubscriptionEvent(
  event: string, 
  metadata: object
) {
  const supabase = createClient()
  
  await supabase.from('analytics_events').insert({
    event_type: event,
    metadata: {
      ...metadata,
      currency: 'CHF',
      region: 'swiss'
    },
    created_at: new Date().toISOString()
  })
  
  // Also send to external analytics if configured
  if (process.env.ANALYTICS_API_KEY) {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, metadata })
    })
  }
}

// Usage examples
await trackSubscriptionEvent('subscription_created', { 
  plan: 'pro', 
  amount: 1990,  // CHF 19.90 in Rappen
  currency: 'CHF' 
})

await trackSubscriptionEvent('subscription_cancelled', { 
  plan: 'starter',
  cancellation_reason: 'user_request'
})
```

---

## 🔧 Development Workflow

### Service Testing

**Lokale Service-Tests:**

```bash
# 1. Infrastructure starten
cd infrastructure/
docker compose up -d

# 2. Services testen
curl http://localhost:55321/health  # Supabase API
curl http://localhost:55323         # Studio Interface

# 3. Webhook Testing (Stripe CLI)
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 4. Email Testing (Development)
# Emails werden an Inbucket gesendet: http://localhost:9001
```

### Service Integration Workflow

```bash
# 1. Environment setup
cp .env.example .env.local
# → API Keys konfigurieren

# 2. Database setup  
pnpm run db:setup

# 3. Services verifizieren
pnpm run dev
# → Test Registration/Login
# → Test Subscription Checkout
# → Check Email Delivery

# 4. Production Deployment
# → Live API Keys konfigurieren
# → Webhook Endpoints aktualisieren
# → Domain & SSL Setup
```

---

## 🚨 Troubleshooting

### Stripe Integration

**Webhook Verification:**
```bash
# Test webhook endpoint
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Verify webhook secret
echo $STRIPE_WEBHOOK_SECRET

# Test payment flow
# Use test card: 4242 4242 4242 4242
```

**TWINT Issues:**
```bash
# Verify Swiss business account
# Check payment methods in Stripe Dashboard
# Ensure CHF currency is configured
```

### Supabase Connection

**Database Connection:**
```bash
# Test database connectivity
docker exec supabase-db pg_isready -U postgres

# Check service logs
docker compose logs supabase-db kong
```

**Auth Issues:**
```bash
# Verify JWT keys match
# Check infrastructure/.env.local vs template/.env.local
# Ensure SUPABASE_SERVICE_ROLE_KEY is correct
```

### Email Delivery

**Resend Configuration:**
```bash
# Test API key
curl -H "Authorization: Bearer $RESEND_API_KEY" https://api.resend.com/emails

# Check domain verification
# Verify DNS records: SPF, DKIM, DMARC
```

**Development Email:**
```bash
# Check Inbucket container
docker compose logs inbucket
# Access UI: http://localhost:9001
```

---

## ✅ Integration Checklist

### Setup Verification
- [ ] Supabase API erreichbar (localhost:55321)
- [ ] Database Studio funktioniert (localhost:55323)
- [ ] Stripe Test Keys konfiguriert
- [ ] Webhook Endpoint aktiv
- [ ] Resend API Key gesetzt
- [ ] Email Templates funktionieren

### Funktionalität Tests
- [ ] User Registration/Login
- [ ] Subscription Checkout (CHF)
- [ ] TWINT Payment Test
- [ ] Email Delivery (Welcome, Invoice)
- [ ] Webhook Verarbeitung
- [ ] Error Tracking aktiv

### Production Readiness
- [ ] Live API Keys konfiguriert
- [ ] Custom Domain mit SSL
- [ ] Webhook Endpoints live
- [ ] Email Domain verifiziert
- [ ] Monitoring Setup
- [ ] Error Tracking konfiguriert

---

**Integration Status:** Production-Ready ✅  
**Swiss Optimized:** CHF + TWINT + de-CH ✅  
**Self-Hosted:** Database + Auth ✅