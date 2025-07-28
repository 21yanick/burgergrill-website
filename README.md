# NextJS Dual-Mode Starter Kit

**Production-Ready Business Template: SaaS ↔ Shop in 5 Minuten**

Vollständig funktionsfähiges Template für **E-Commerce** oder **SaaS Subscriptions** mit Swiss Optimization. Self-hosted Stack mit Supabase, Stripe Integration und modernem Development Setup.

## 🚀 Schnellstart

```bash
# 1. Infrastructure starten
cd infrastructure && docker compose up -d

# 2. Development starten  
cd ../template
pnpm install && pnpm run dev
```

**Bereit:** [App](http://localhost:3000) | [Datenbank](http://localhost:55323)

## 🛠️ Tech Stack

**Frontend:** Next.js 15 • React 19 • TypeScript • Tailwind CSS 4  
**Backend:** Supabase (self-hosted) • PostgreSQL • Docker  
**Payments:** Stripe Integration • CHF + TWINT  
**State:** Zustand + Persist • Server Actions  
**Email:** Resend Integration (German Templates)  
**Components:** Radix UI • shadcn/ui

## ✨ Features

### 🇨🇭 Swiss Business Optimization
- **CHF Währung** mit Rappen-Precision
- **TWINT + Karte** Zahlungsmethoden
- **de-CH Lokalisierung** (Datum, Währung, Sprache)
- **Schweizer Adressen** und Postleitzahlen-Validierung
- **DSGVO-konforme** Datenverarbeitung

### 🛍️ E-Commerce System (Production Ready)
- **Produktkatalog** mit Stripe Price Integration
- **Shopping Cart** mit Zustand Persistence
- **Guest Checkout** ohne Account-Zwang
- **Order Management** Dashboard für Shop Owner
- **Digital + Physical** Products Support
- **Email Confirmations** und Status Updates

### 💼 SaaS Subscription System (Production Ready)
- **Subscription Plans** mit monatlicher Abrechnung
- **Billing Dashboard** für Kunden
- **Usage Tracking** und Account Management
- **Stripe Customer Portal** Integration
- **Webhook-driven** Subscription Events

### 🔐 Vollständige Authentication
- Email/Passwort Registrierung und Login
- Geschützte Routen und Middleware
- Benutzerprofile und Session-Management
- Passwort zurücksetzen Flow

### 🏗️ Moderne Architektur
- **Next.js 15** mit App Router und Server Actions
- **React 19** mit Server Components
- **TypeScript** Strict Mode mit Zod Schemas
- **Zustand** State Management mit Persist
- **Dark/Light Theme** mit System Detection
- **Mobile-First** Responsive Design

### 🐳 Self-Hosted Infrastructure
- **PostgreSQL** Datenbank mit Migrations
- **Supabase** Authentication und Real-time API
- **Docker Compose** Development Stack
- **Kong Gateway** und Observability Stack

### 📧 Professional Email System
- **Resend Integration** für transactional Emails
- **React Email** Templates (Order, Billing, Welcome)
- **Swiss Formatierung** (CHF, de-CH Datum)
- **Production-ready** Domain Setup

## 📁 Projekt-Struktur

```
template/                # Haupt-Development Template
├── app/
│   ├── (marketing)/
│   │   ├── shop/           # 🟩 SHOP-ONLY (E-Commerce)
│   │   └── pricing/        # 🟦 SAAS-ONLY (Subscriptions)
│   ├── dashboard/
│   │   ├── orders/         # 🟩 SHOP-ONLY (Order Management)
│   │   └── subscription/   # 🟦 SAAS-ONLY (Billing)
│   └── api/               # ✅ SHARED (Webhooks, Auth)
├── components/
│   ├── shop/              # 🟩 SHOP-ONLY (Cart, Products)
│   ├── billing/           # 🟦 SAAS-ONLY (Plans, Checkout)
│   └── ui/                # ✅ SHARED (Design System)
└── lib/
    ├── shop/              # 🟩 SHOP-ONLY (One-time Payments)
    ├── plans.ts           # 🟦 SAAS-ONLY (Subscription Plans)
    └── config.ts          # ✅ SHARED (Core Configuration)

infrastructure/             # Docker Compose Stack
├── docker-compose.yml     # Service Definitionen
├── volumes/db/            # Database Schema (Both Models)
└── .env.local            # Infrastructure Konfiguration
```

## 🔄 Dual-Mode Architecture

### SaaS ↔ Shop Conversion (5 Minuten)

**SaaS → Shop:**
```bash
# 1. Remove SaaS components
rm -rf app/(marketing)/pricing/ app/dashboard/subscription/ components/billing/ lib/plans.ts

# 2. Update navigation (1 line): /pricing → /shop in components/layout/header.tsx

# 3. Done! Shop system is fully functional
```

**Shop → SaaS:**
```bash  
# 1. Remove Shop components
rm -rf app/(marketing)/shop/ app/dashboard/orders/ components/shop/ lib/shop/

# 2. Update navigation (1 line): /shop → /pricing in components/layout/header.tsx

# 3. Done! SaaS system is fully functional
```

**Warum so einfach?** Beide Systeme laufen parallel mit clean code separation. Keine Database Migration nötig!

## 🔧 Konfiguration

Das Template kommt vorkonfiguriert mit:
- **Währung:** CHF mit Rappen-Precision
- **Sprache:** Deutsch (de-CH) mit Schweizer Formatierung  
- **Payments:** Stripe mit Karte und TWINT Support
- **Business Models:** SaaS Subscriptions + E-Commerce Shop
- **Zeitzone:** Europe/Zurich

`lib/config.ts` anpassen für Ihre Region:

```typescript
export const siteConfig = {
  name: "Ihr App Name",
  currency: "CHF" as const,
  locale: "de-CH" as const,
  
  // Für SaaS: Subscription Pricing
  subscription: {
    starter: 2990, // 29.90 CHF in Rappen
    pro: 7990      // 79.90 CHF in Rappen
  },
  
  // Für Shop: Product Configuration
  shop: {
    shipping: { countries: ['CH'] },
    digitalProducts: true,  // Support digital products
    physicalProducts: true  // Support physical products
  }
}
```

## 🧪 Development

### Tägliche Commands
```bash
pnpm run dev          # Development Server
pnpm run build        # Production Build  
pnpm run lint         # Code Linting
pnpm run type-check   # TypeScript Validierung
```

### Infrastructure Management
```bash
cd infrastructure/
docker compose up -d      # Services starten
docker compose down       # Services stoppen  
docker compose ps         # Service Status
```

### Datenbank
- **Management:** [Supabase Studio](http://localhost:55323)
- **Direkter Zugriff:** `docker exec -it supabase-db psql -U postgres`
- **Migrations:** SQL Dateien in `infrastructure/volumes/db/`

## 📚 Dokumentation

- **[Schnellstart](docs/01-quickstart.md)** - Komplette Setup Anleitung
- **[SaaS ↔ Shop Conversion](docs/06-customization.md)** - 5-Minuten Business Model Wechsel
- **[Development](docs/05-development.md)** - Development Workflow
- **[Service Integration](docs/04-integrations.md)** - Stripe, Supabase, Resend Setup
- **[Infrastructure](infrastructure/README.md)** - Docker Setup Details

## 🔑 Environment Setup

### Template Konfiguration
```env
# Datenbank
NEXT_PUBLIC_SUPABASE_URL=http://localhost:55321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SaaS Subscription Products
STRIPE_STARTER_PRICE_ID=price_...     # Monatliche Subscription
STRIPE_PRO_PRICE_ID=price_...         # Monatliche Subscription

# Shop One-time Products  
STRIPE_PRODUCT_1_PRICE_ID=price_...   # T-Shirt 24.90 CHF
STRIPE_PRODUCT_2_PRICE_ID=price_...   # Digital Guide 19.90 CHF

# Email Service
RESEND_API_KEY=re_your_api_key
EMAIL_DOMAIN=yourdomain.ch

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Infrastructure Konfiguration
```env
# Secrets (für Production ändern)
POSTGRES_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret-32-chars-min
ANON_KEY=your_anon_key
SERVICE_ROLE_KEY=your_service_role_key

# Ports
KONG_HTTP_PORT=55321
STUDIO_PORT=55323
```

## 🚀 Production Deployment

1. **Business Model:** SaaS oder Shop entscheiden (5-Min Conversion)
2. **Environment:** Production `.env.local` mit Live Stripe Keys
3. **Datenbank:** Managed PostgreSQL oder Self-hosting
4. **Payments:** Stripe Webhooks und Live Mode konfigurieren
5. **Domain:** Custom Domain mit SSL und Email-Domain Setup
6. **Monitoring:** Error Tracking und Analytics konfigurieren

---

**Status:** Production Ready ✅ (SaaS + Shop)  
**Swiss Optimized:** CHF • TWINT • de-CH • DSGVO  
**Lizenz:** MIT • **Node.js:** 18+ erforderlich