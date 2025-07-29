# 🍔 Burgergrill Website

**Authentische Cevapcici & Burger aus Zürich** - Moderne Restaurant One-Pager mit Next.js 15 + Supabase

**Status: Phase 1 - UI zu 95% komplett** | Schweizer Restaurant mit KG-Verkauf, Location-Finder und CMS-Dashboard

Spezialisiert auf authentische Cevapcici nach traditionellem Balkan-Rezept, premium Burger mit schweizer Rindfleisch und kilogrammweisen Verkauf für Events. Vollständig responsive Design mit echter Zürich-Integration.

## ✨ Live Features (Phase 1 - 95% komplett)

### 🍔 **Restaurant One-Pager** 
- **Hero Section**: Cevapcici-fokussierte Landingpage mit CTAs zu KG-Verkauf und Menü
- **Menu Display**: 3 Kategorien (Cevapcici-Burger, Klassische Burger, Würste & Grill) mit CHF-Preisen
- **KG-Verkauf System**: Dialog-basierte Bestellungen für kilogrammweise Produkte (Events/Partys)
- **Location & Hours**: Interaktive Karte, Öffnungszeiten, Kontaktdaten (Bahnhofstrasse 47, Zürich)
- **Restaurant Footer**: Social Media, Kontaktdaten, Dashboard-Link für Inhaber
- **Mobile-First**: Vollständig responsive für Smartphone-Bestellungen

### 🇨🇭 **Swiss Integration**
- **Echte Adresse**: Bahnhofstrasse 47, 8001 Zürich mit Google Maps Integration
- **Schweizer Telefon**: +41 44 123 45 67 (klickbar für direkte Anrufe)
- **CHF-Preise**: Alle Menüpreise in Schweizer Franken formatiert
- **Deutsche Lokalisierung**: Authentische Texte, "Sie"-Form, schweizer Begriffe
- **Öffnungszeiten**: Mo geschlossen, Di-Sa 11-22h, So 12-21h mit "Heute"-Indikator

### 🏗️ **Technische Architektur**
- **Komponenten-Struktur**: Domain-separierte `/components/restaurant/` Organisation
- **Supabase Integration**: PostgreSQL + Authentication + RLS Policies 
- **Email System**: Resend-Integration für KG-Verkauf Bestätigungen (vorbereitet)
- **Theme System**: Dark/Light Mode mit restaurant-spezifischen Accent-Farben

## 🚀 Schnellstart

```bash
# 1. Environment-Dateien erstellen
cd infrastructure && cp .env.example .env
cd ../template && cp .env.example .env.local

# 2. Infrastructure starten (erstes Mal dauert ~2-3 Minuten)
cd infrastructure && docker compose up -d

# 3. Development starten  
cd ../template
pnpm install && pnpm run dev
```

**Bereit:** 
- 🍔 **Website**: http://localhost:3000
- 🗄️ **Database Studio**: http://localhost:56323 (supabase / this_password_is_insecure_and_should_be_updated)
- 📊 **Analytics**: http://localhost:4000
- 🔌 **API**: http://localhost:56321

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React 19, App Router, TypeScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **React Email** - Email templates
- **Resend** - Email delivery service

### Backend & Infrastructure
- **Supabase Self-Hosted** - PostgreSQL + Authentication + Storage + Realtime
- **Docker Compose** - 16 Services für vollständigen Stack
- **Kong Gateway** - API Gateway und Routing
- **Vector** - Log aggregation und Analytics
- **ImgProxy** - Image processing und optimization

### Database Schema
- **Core Schema** - User profiles, authentication, file storage
- **Swiss Localization** - CHF currency, de-CH locale
- **Row Level Security** - Sichere Datenbank-Policies
- **Automatic Triggers** - Profile creation, timestamps

## 📁 Projekt-Struktur

```
burgergrill-website/
├── KONZEPT.md              # 🎯 Restaurant Konzept & 3-Phasen Roadmap
├── infrastructure/          # Supabase Self-Hosted Stack
│   ├── docker-compose.yml   # 16 Services (Postgres, Kong, Studio, etc.)
│   ├── .env                 # Infrastructure configuration
│   └── volumes/
│       ├── db/              # Database schemas und init scripts
│       └── logs/            # Vector logging configuration
├── template/                # Next.js Restaurant Website
│   ├── app/
│   │   ├── (marketing)/     # Restaurant One-Pager
│   │   │   └── page.tsx     # 🍔 Haupt-Landingpage mit allen Sections
│   │   ├── dashboard/       # 👨‍💼 Restaurant-CMS (Phase 2)
│   │   └── auth/           # 🔐 Benutzer-Authentication
│   ├── components/
│   │   ├── restaurant/      # 🍔 Restaurant-spezifische Komponenten
│   │   │   ├── hero/        # Hero Section mit Cevapcici-Focus
│   │   │   ├── menu/        # Menu Display (3 Kategorien, CHF-Preise)
│   │   │   ├── kg-verkauf/  # KG-Verkauf Dialog System
│   │   │   ├── location/    # 📍 Standort, Öffnungszeiten, Karte (NEU)
│   │   │   └── index.ts     # Barrel Exports
│   │   ├── layout/          # Header, Footer (Restaurant-Navigation)
│   │   ├── auth/           # Benutzer-Authentication
│   │   └── ui/             # shadcn/ui Base Components
│   ├── lib/
│   │   ├── config.ts       # 🇨🇭 Swiss Site Config (CHF, de-CH, Zürich)
│   │   ├── supabase/       # Database Connection & Auth
│   │   └── email/          # Resend Email Templates
│   └── .env.local          # Application configuration
└── README.md               # Diese Datei
```

## 🧩 Restaurant Komponenten-Architektur

### `/components/restaurant/` - Domain-separierte Organisation

```typescript
// Barrel Export Pattern für saubere Imports
import { HeroSection, MenuSection, KgVerkaufSection, LocationSection } from '@/components/restaurant'

// Hero Section - Cevapcici-focused Landing
HeroSection
├── hero-content.tsx     # CTAs zu KG-Verkauf und Menü
├── hero-section.tsx     # Container mit Gradient-Background
└── types.ts            # HeroProps Interface

// Menu Section - 3 Kategorien mit CHF-Preisen  
MenuSection
├── menu-section.tsx     # Container + Section Header
├── menu-grid.tsx       # Responsive Grid Layout
├── menu-category.tsx   # Kategorie-Container
├── menu-item.tsx       # Einzelne Speise mit Preis/Allergenen
└── types.ts           # MenuData Interfaces

// KG-Verkauf System - Dialog-basierte Bestellungen
KgVerkaufSection  
├── kg-verkauf-section.tsx   # Landing Section mit Features
├── kg-verkauf-dialog.tsx    # Modal mit Produkt-Auswahl
└── types.ts                # KgOrderData Interface

// Location & Hours - Zürich Integration (NEU implementiert)
LocationSection
├── location-section.tsx     # 2-Column Layout Container
├── contact-info.tsx        # Adresse, Telefon, Email mit Icons
├── opening-hours.tsx       # Öffnungszeiten mit "Heute" Highlight  
├── map-embed.tsx          # Google Maps + Route Planner
└── types.ts              # LocationData Interface
```

### Schweizer Restaurant-Daten (Konsistent verwendet)
```typescript
// Echte Zürich-Integration in allen Komponenten
const restaurantData = {
  address: "Bahnhofstrasse 47, 8001 Zürich",
  phone: "+41 44 123 45 67",
  email: "info@burgergrill.ch",
  hours: "Mo: Geschlossen • Di-Sa: 11-22h • So: 12-21h"
}
```

## 🔧 Konfiguration

### Ports (konfliktfrei zu anderen Projekten)
- **Kong API Gateway**: 56321
- **Supabase Studio**: 56323  
- **Analytics Dashboard**: 4000
- **Next.js Development**: 3000
- **PostgreSQL Direct**: 5432
- **Connection Pooler**: 6543

### Environment Variables

**Infrastructure (.env)**:
```bash
# Database & Security
POSTGRES_PASSWORD=your-super-secret-password
JWT_SECRET=your-super-secret-jwt-token-32-chars-min

# Service Ports
KONG_HTTP_PORT=56321
STUDIO_PORT=56323

# Site Configuration  
SITE_URL=http://localhost:3000
API_EXTERNAL_URL=http://localhost:56321
```

**Application (.env.local)**:
```bash
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=http://localhost:56321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Service (optional)
RESEND_API_KEY=re_YOUR_RESEND_API_KEY_HERE
```

## 🗄️ Database Schema

### Core Tables
- **`auth.users`** - Supabase Authentication (built-in)
- **`public.profiles`** - Extended user profiles
- **`storage.buckets`** - File storage (avatars, uploads)

### Security Features
- ✅ **Row Level Security (RLS)** auf allen Tabellen
- ✅ **JWT Authentication** mit secure policies  
- ✅ **Automatic Profile Creation** via database triggers
- ✅ **Secure File Upload** policies

## 📧 Email System

**Restaurant-spezifische Email Templates**:
- **Welcome Email** - Begrüssung neuer Benutzer
- **Password Reset** - Sichere Passwort-Wiederherstellung
- **Swiss Localization** - Deutsche Texte, CHF Preise

**Email Provider**: Resend (einfach zu konfigurieren, Swiss-friendly)

## 🔐 Authentifizierung

**Supabase Auth Features**:
- ✅ Email/Password Registration & Login
- ✅ Password Reset Flow
- ✅ Email Confirmation (optional)
- ✅ Protected Routes mit Middleware
- ✅ Client & Server-side Authentication

**Auth Flow**:
1. User registriert sich → Profile wird automatisch erstellt
2. Email confirmation (development: auto-confirm)  
3. JWT Token für sichere API calls
4. Row Level Security policies für Datenschutz

## 🚀 Deployment

### Development
```bash
# Infrastructure starten
cd infrastructure && docker compose up -d

# Application development
cd template && pnpm dev
```

### Production Preparation
1. **Secrets ändern** - Alle passwords und keys in .env files
2. **SSL Certificates** - HTTPS für production deployment
3. **Domain Configuration** - SITE_URL und API_EXTERNAL_URL anpassen
4. **Database Backup** - Regelmässige Backups einrichten

## 🐛 Troubleshooting

### Container Probleme
```bash
# Status prüfen
docker compose ps

# Logs anschauen
docker compose logs [service-name]

# Fresh restart
docker compose down -v
rm -rf volumes/db/data/  # ACHTUNG: Löscht alle Daten!
docker compose up -d
```

### Database Issues
- **"Database already exists"** → `rm -rf volumes/db/data/` und container restart
- **Analytics container unhealthy** → meist wegen fehlender init schemas
- **Realtime connection issues** → normal beim ersten Start, stabilisiert sich

### Development Issues
```bash
# TypeScript Errors prüfen
cd template && pnpm run type-check

# Build testen
pnpm run build

# Dependencies aktualisieren
pnpm install
```

## 🗺️ Roadmap & Implementierungsstatus

### ✅ **Phase 1: One-Pager Foundation (95% komplett)**
- ✅ **Hero Section** - Authentische Cevapcici-Landing mit Restaurant-Branding
- ✅ **Menu Display** - 3 Kategorien mit CHF-Preisen und Allergenkennzeichnung
- ✅ **KG-Verkauf System** - Dialog-Interface für kilogrammweise Bestellungen  
- ✅ **Location & Hours** - Zürich-Integration mit Google Maps und Öffnungszeiten
- ✅ **Restaurant Footer** - Social Media, Kontaktdaten, Dashboard-Link
- ✅ **Restaurant Header** - Navigation zu allen Sections (Speisekarte, KG-Verkauf, Standort)
- ✅ **Swiss Localization** - Deutsche Texte, CHF-Preise, Schweizer Telefonnummern
- ✅ **Mobile Responsive** - Vollständig optimiert für Smartphone-Nutzung

**Noch ausstehend in Phase 1:**
- 🔧 Bordeaux-Rot Farbschema (`#8B0000`) - aktuell Orange-ish Accent  
- 🖼️ Restaurant-Logo + Food-Hero-Images (Platzhalter vorhanden)

### 🚧 **Phase 2: Dashboard CMS (nicht gestartet)**
- ❌ Database Schema Update (restaurant_settings, kg_orders, menu_items)
- ❌ Öffnungszeiten Editor im Dashboard
- ❌ KG-Verkauf Bestellungen Management
- ❌ Ferien/Geschlossen Manager mit Website-Banner
- ❌ Menu Management (Items hinzufügen/bearbeiten)
- ❌ KG-Verkauf Backend-Integration mit Resend Email

### 🔮 **Phase 3: Polish & SEO (geplant)**
- ❌ SEO Optimization (Meta Tags, Structured Data, Sitemap)
- ❌ Performance Optimization (Image Optimization, Caching, Code Splitting)
- ❌ Enhanced Mobile Experience (Touch Gestures, App-like Behavior)
- ❌ Analytics Integration für Restaurant-Insights

## 📊 Aktuelle Features (Live & Getestet)

### 🍔 **Restaurant One-Pager** 
- **Authentische Inhalte**: Cevapcici-fokussiert nach Balkan-Tradition
- **3 Menu-Kategorien**: Cevapcici-Burger (Signature), Klassische Burger, Würste & Grill
- **CHF-Preise**: 14.50-24.50 CHF Range, formatiert mit schweizer Locale
- **KG-Verkauf Dialog**: Produktauswahl, Kundendaten, Preis-Kalkulation
- **"Heute" Öffnungszeiten**: Intelligente Hervorhebung des aktuellen Wochentags
- **Google Maps Integration**: Directions, Route Planning, Map Embed Placeholder

### 🇨🇭 **Swiss Restaurant Integration**
- **Echte Zürich-Adresse**: Bahnhofstrasse 47, 8001 Zürich (konsistent überall)
- **Klickbare Kontakte**: `tel:+41 44 123 45 67` und `mailto:info@burgergrill.ch`
- **Schweizer Öffnungszeiten**: Mo geschlossen, Di-Sa 11-22h, So 12-21h
- **Deutsche Lokalisierung**: Authentische Texte, "Sie"-Form, restaurant-spezifische Begriffe
- **CHF-Währung**: Intl.NumberFormat mit de-CH Locale in allen Preisanzeigen

### 🏗️ **Technische Features**
- **Domain-Driven Components**: `/components/restaurant/` mit klarer Separation
- **TypeScript Interfaces**: Vollständig typisierte Restaurant-Daten
- **Responsive Design**: Mobile-first mit 2-Column Desktop Layouts
- **Dark/Light Mode**: Theme-aware mit restaurant-spezifischen Accent-Farben
- **Accessibility**: WCAG-konforme Icons, Keyboard Navigation, Screen Reader Support

## 📄 License

Developed for Burgergrill Restaurant Website.

---

**Built with ❤️ in Switzerland** 🇨🇭