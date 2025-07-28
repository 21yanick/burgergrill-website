# 🏗️ Systemarchitektur

**Modulares NextJS Starter Kit mit selbst-gehosteter Supabase Infrastruktur**

Ein flexibles Template-System, das standardmäßig als SaaS konfiguriert ist, aber einfach für andere Anwendungen umgebaut werden kann.

---

## 🎯 Architektur-Überblick

Das Starter Kit besteht aus zwei Hauptkomponenten:

```
┌─────────────────────────────────────────────────────────┐
│                    NextJS Template                     │
│                  (template/)                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │    Pages    │ │ Components  │ │    API      │      │
│  │ SaaS/Shop   │ │   UI/Auth   │ │   Routes    │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│              Infrastructure Services                   │
│               (infrastructure/)                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ PostgreSQL  │ │    Kong     │ │   Studio    │      │
│  │ (Database)  │ │ (Gateway)   │ │(Management) │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
└─────────────────────────────────────────────────────────┘
```

### Service-Verteilung

| Service | Port | Zweck |
|---------|------|-------|
| **NextJS App** | 3000 | Template Development |
| **Kong Gateway** | 55321 | API Gateway und Auth |
| **Supabase Studio** | 55323 | Database Management |
| **PostgreSQL** | 5432 | Interne Datenbank |

---

## 🗄️ Modulare Datenbank-Architektur

### Schema-Module System

Das Starter Kit verwendet ein intelligentes Schema-System in `infrastructure/volumes/db/business-schema.sql`:

```sql
-- Kern-Schema (immer geladen)
\i 00-core-schema.sql

-- Standard: SaaS Schema (geladen)  
\i 01-saas-schema.sql

-- Optional: Shop Schema (auskommentiert)
-- \i 02-shop-schema.sql

-- Optional: Booking Schema (auskommentiert)  
-- \i 03-booking-schema.sql
```

### Verfügbare Schema-Module

**00-core-schema.sql** - Basis für alle Anwendungen
- `profiles` - Erweiterte Benutzerprofile
- Benutzer-Management und Authentication
- Row Level Security (RLS) Policies

**01-saas-schema.sql** - SaaS Funktionalität (Standard)
- `subscriptions` - Stripe Abonnements
- Plan-Management (free, starter, pro, enterprise)
- Billing und Subscription-Status

**02-shop-schema.sql** - E-Commerce Funktionalität (Optional)
- `products` - Produktkatalog mit CHF-Preisen
- `orders` - Bestellungen und Checkout
- `order_items` - Warenkorbverwaltung

**03-booking-schema.sql** - Terminhbuchung (Optional)
- `appointments` - Terminkalender
- `services` - Buchbare Dienstleistungen
- `availability` - Verfügbarkeitsverwaltung

### Schema-Aktivierung

Um Module zu aktivieren:

```sql
-- 1. business-schema.sql bearbeiten
-- 2. Zeile uncomment: \i 02-shop-schema.sql
-- 3. Docker Services neustarten
```

```bash
cd infrastructure/
docker compose restart supabase-db
```

---

## 💻 Template-Architektur

### Aktuelle Struktur

Das Template ist standardmäßig als **SaaS** konfiguriert, enthält aber bereits Strukturen für andere Anwendungen:

```
template/
├── app/
│   ├── (marketing)/           # Öffentliche Seiten
│   │   ├── page.tsx          # Landing Page (SaaS)
│   │   ├── pricing/          # SaaS Pricing
│   │   ├── shop/             # Shop Page (vorhanden!)
│   │   └── features/         # Feature-Übersicht
│   ├── dashboard/            # Geschützte Bereiche
│   │   ├── page.tsx          # User Dashboard
│   │   └── subscription/     # SaaS Verwaltung
│   └── api/                  # Backend Routes
│       ├── checkout/         # Stripe Integration
│       └── webhooks/         # Payment Events
├── components/
│   ├── billing/              # SaaS Components
│   ├── auth/                 # Authentication
│   └── ui/                   # Base UI Components
└── lib/
    ├── config.ts            # Zentrale Konfiguration
    ├── stripe/              # Payment Integration  
    └── plans.ts             # SaaS Plan-Definitionen
```

### Template-Flexibilität

Das Template ist so aufgebaut, dass es einfach umgebaut werden kann:

**SaaS → Shop Umbau:**
1. Navigation von `/pricing` zu `/shop` ändern
2. `components/billing/` durch `components/shop/` ersetzen
3. `dashboard/subscription/` entfernen oder anpassen
4. Shop Schema aktivieren (`\i 02-shop-schema.sql`)

**Universell nutzbare Components:**
- `components/auth/` - Authentication (immer benötigt)
- `components/ui/` - Base UI Components
- `components/layout/` - Header, Footer, Navigation

---

## 🔧 Infrastruktur-Services

### Docker Compose Stack

Die Infrastructure läuft komplett in Docker und bietet:

**PostgreSQL Database**
- Automatische Schema-Initialisierung
- Modulare SQL-Dateien
- Row Level Security (RLS) 
- Backup über Docker Volumes

**Kong API Gateway**
- JWT Token Validation
- CORS und Rate Limiting
- Zentrale API-Verwaltung
- Health Checks

**Supabase Studio**
- Database Management Interface
- SQL Query Interface
- User Management
- Real-time Data Viewer

**Weitere Services:**
- Vector (Logging)
- Storage (File Upload)
- Realtime (WebSocket)
- Analytics (Usage Tracking)

### Entwicklung vs. Produktion

| Aspekt | Entwicklung | Produktion |
|--------|-------------|------------|
| **Datenbank** | Docker PostgreSQL | Managed PostgreSQL |
| **JWT Secrets** | Demo Keys | Sichere Production Keys |
| **SSL/TLS** | HTTP (localhost) | HTTPS (Custom Domain) |
| **Email** | Mock SMTP | Echter SMTP Service |
| **Monitoring** | Docker Logs | External Monitoring |

---

## ⚙️ Konfiguration und Umgebung

### Template-Konfiguration

Zentrale Konfiguration in `lib/config.ts`:

```typescript
export const siteConfig = {
  name: "SaaS Starter",
  description: "100% self-hosted SaaS starter kit...",
  currency: "CHF" as const,
  region: "swiss" as const,
  locale: "de-CH" as const,
  pricing: {
    starter: 9.90,
    pro: 19.90
  }
}
```

### Environment-Variablen

Template `.env.local` (bereits konfiguriert):

```env
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=http://localhost:55321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Stripe Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Keine Feature Flags

Das Template verwendet **keine Environment-basierten Feature Flags**. Stattdessen:

- **Modulare Struktur**: Pages und Components nach Bedarf
- **SQL Module**: Schema nach Bedarf aktivieren
- **Einfacher Umbau**: Code-Level Anpassungen

---

## 🔄 Development Workflow

### Lokale Entwicklung

```bash
# 1. Infrastructure starten
cd infrastructure/
docker compose up -d

# 2. Template entwickeln
cd template/
pnpm install
pnpm run dev
```

### Schema-Anpassungen

```bash
# 1. SQL-Datei bearbeiten
vi infrastructure/volumes/db/business-schema.sql

# 2. Database neustarten  
docker compose restart supabase-db

# 3. Änderungen in Studio überprüfen
open http://localhost:55323
```

### Template-Anpassungen

```bash
# 1. Template-Dateien anpassen
# 2. Development Server läuft automatisch weiter
# 3. Änderungen sind sofort sichtbar
```

---

## 🏗️ Skalierung und Erweiterung

### Template Erweiterung

Das Template kann einfach erweitert werden:

1. **Neue Pages**: `app/` Verzeichnis
2. **Neue Components**: `components/` Verzeichnis  
3. **Neue API Routes**: `app/api/` Verzeichnis
4. **Neue Schemas**: `volumes/db/` SQL-Dateien

### Infrastructure Scaling

Für Production Deployment:

1. **Managed Database**: PostgreSQL Cloud Service
2. **Load Balancer**: Multiple App Instances
3. **CDN**: Static Asset Delivery
4. **Monitoring**: External Monitoring Service

### Modulare Entwicklung

Das System unterstützt modulare Entwicklung:

- **Schema-Module**: SQL nach Bedarf laden
- **Component-Module**: UI nach Anwendung
- **Service-Integration**: APIs nach Bedarf
- **Template-Varianten**: Verschiedene Anwendungen

---

## 📊 Überwachung und Logs

### Development Monitoring

```bash
# Service Status
docker compose ps

# Live Logs  
docker compose logs -f

# Database Status
docker exec supabase-db pg_isready -U postgres
```

### Studio Interface

- **Tables**: Schema und Daten verwalten
- **Authentication**: Benutzer-Management
- **Storage**: Datei-Upload verwalten
- **SQL Editor**: Direkte Datenbankabfragen

### Performance Monitoring

- **Next.js Build**: Bundle-Größe Analyse
- **Database**: Query Performance
- **Docker**: Container Resource Usage
- **Network**: API Response Times

---

**Status:** Production-Ready ✅  
**Modular:** Schema + Template ✅  
**Flexibel:** SaaS/Shop/Booking ✅