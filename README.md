# 🍔 Burgergrill Website

**Das beste Burgergrill der Schweiz** - Moderne Restaurant-Website mit Next.js 15 + Supabase

Vollständig restaurant-fokussierte Website mit User-Management, sauberer Authentication und Swiss Localization. Self-hosted Supabase Stack für maximale Kontrolle und Performance.

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
├── infrastructure/          # Supabase Self-Hosted Stack
│   ├── docker-compose.yml   # 16 Services (Postgres, Kong, Studio, etc.)
│   ├── .env                 # Infrastructure configuration
│   └── volumes/
│       ├── db/              # Database schemas und init scripts
│       └── logs/            # Vector logging configuration
├── template/                # Next.js Restaurant Website
│   ├── app/                 # App Router (Next.js 15)
│   ├── components/          # UI Components (auth, layout, ui)
│   ├── lib/                 # Utilities, config, email
│   └── .env.local           # Application configuration
└── README.md               # Diese Datei
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

## 📝 Features

### Restaurant-spezifisch
- 🍔 **Burgergrill Branding** - Schweizer Restaurant Design
- 🇨🇭 **Swiss Localization** - Deutsche Sprache, CHF Currency
- 📱 **Responsive Design** - Mobile-first, perfekt für Smartphone-Bestellungen
- 🔐 **User Accounts** - Kunden können Accounts erstellen
- 📧 **Email Integration** - Automatische Begrüssungs-Emails

### Technisch  
- ⚡ **Performance** - Next.js 15, Image Optimization, Static Generation
- 🔒 **Security** - Row Level Security, JWT Authentication, HTTPS ready
- 📊 **Analytics** - Integrierte Logflare Analytics für User Insights
- 🐳 **Self-Hosted** - Komplette Kontrolle über alle Services
- 🔧 **Developer Experience** - TypeScript, ESLint, Prettier, Hot Reload

## 📄 License

Developed for Burgergrill Restaurant Website.

---

**Built with ❤️ in Switzerland** 🇨🇭