# 🚀 Schnellstart Anleitung

**NextJS Starter Kit in 5 Minuten zum Laufen bringen**

## ✅ Voraussetzungen

- Docker Desktop (läuft)
- Node.js 18+ 
- pnpm oder npm
- Ports 3000, 55321-55323 verfügbar

```bash
# Setup überprüfen
docker --version && node --version
```

## 🏗️ Setup (2 Schritte)

### 1. Infrastructure starten (2 min)
```bash
git clone [repo-url] nextjs-starter
cd nextjs-starter/infrastructure
docker compose up -d
```

Warten bis alle Services bereit sind:
```bash
docker compose ps
# Alle Services sollten "healthy" Status zeigen
```

### 2. Template Development starten (1 min)
```bash
cd ../template
pnpm install
pnpm run dev
```

**✅ Bereit:** [App](http://localhost:3000) | [Datenbank](http://localhost:55323)

## 🔍 Setup Überprüfen

### Schnell-Test Checklist
- [ ] [App lädt](http://localhost:3000) - Hauptanwendung
- [ ] [Studio funktioniert](http://localhost:55323) - Datenbank Interface  
- [ ] Registrierung erstellt Account - Authentication testen
- [ ] Dashboard erreichbar - Geschützte Routen funktionieren

### Test Account erstellen
1. Gehe zu [Registrierung](http://localhost:3000/auth/register)
2. Account mit beliebiger Email/Passwort erstellen
3. Prüfen in [Supabase Studio](http://localhost:55323) → Authentication → Users

## 🎯 Was Sie bekommen

### Template Features
- **Authentication** - Komplettes Signup/Login System
- **Datenbank** - PostgreSQL mit Supabase Interface
- **Payments** - Stripe Integration (Test Modus)
- **UI Components** - Radix UI mit Tailwind CSS
- **Theme** - Dark/Light Modus Wechsel

### Development Stack
- **Frontend:** Next.js 15 + React 19 + TypeScript
- **Backend:** Self-hosted Supabase Stack
- **Datenbank:** PostgreSQL mit Migrations
- **Styling:** Tailwind CSS + shadcn/ui

## 🛠️ Tägliche Entwicklung

### Wichtige Commands
```bash
# Development
pnpm run dev          # Development Server starten
pnpm run build        # Production Build testen
pnpm run lint         # Code Linting
pnpm run type-check   # TypeScript Validierung

# Infrastructure  
cd infrastructure/
docker compose ps       # Service Status prüfen
docker compose logs -f  # Logs anzeigen
```

## 🔧 Konfiguration

### Template anpassen
`lib/config.ts` bearbeiten:

```typescript
export const siteConfig = {
  name: "Ihr App Name",
  currency: "EUR" as const,  // Von CHF ändern
  locale: "de-DE" as const,  // Von de-CH ändern
  pricing: {
    starter: 9.99,
    pro: 19.99
  }
}
```

### Environment Variablen
Wichtige Variablen in `template/.env.local`:

```env
# Datenbank (automatisch konfiguriert)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:55321
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Payments (Ihre Test Keys hinzufügen)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
```

## 🐛 Troubleshooting

### Häufige Probleme

| Problem | Lösung |
|---------|---------|
| Port 3000 belegt | `lsof -i :3000` → Prozess beenden |
| Docker Services fehlgeschlagen | Docker Desktop läuft prüfen |
| Build Fehler | `rm -rf .next && pnpm run dev` |
| Datenbank Verbindung | `docker compose restart` |

### Infrastructure Probleme

**Services starten nicht:**
```bash
# Verfügbare Ports prüfen
netstat -tulpn | grep :55321

# Infrastructure neustarten
cd infrastructure/
docker compose down && docker compose up -d
```

**Datenbank Verbindung fehlgeschlagen:**
```bash
# Service Logs prüfen
docker compose logs supabase-db
docker compose logs kong

# Datenbank testen
docker exec supabase-db pg_isready -U postgres
```

### Template Probleme

**Authentication funktioniert nicht:**
- Supabase Studio → Settings → API prüfen
- JWT Keys zwischen Infrastructure und Template abgleichen
- Browser Konsole auf Fehler prüfen

**Build Fehlschläge:**
```bash
# Next.js Cache leeren
rm -rf .next node_modules
pnpm install
pnpm run dev
```

### Notfall Reset
```bash
# Kompletter Reset (Nuklear Option)
cd infrastructure/
docker compose down -v
docker compose up -d

cd ../template/
rm -rf .next node_modules
pnpm install
pnpm run dev
```

## 📚 Nächste Schritte

### Stack lernen
- **[Development Guide](05-development.md)** - Täglicher Workflow und Best Practices
- **[Infrastructure Details](../infrastructure/README.md)** - Docker Setup und Services

### App anpassen
1. **Branding:** Logo, Farben und Inhalte aktualisieren
2. **Features:** Ihre Business Logic hinzufügen
3. **Datenbank:** Schema in `infrastructure/volumes/db/` erweitern
4. **Payments:** Stripe mit Ihren Produkten konfigurieren

### Production Deployment
1. Production Datenbank einrichten (Managed PostgreSQL)
2. Live Stripe Keys und Webhooks konfigurieren  
3. Custom Domain mit SSL einrichten
4. Monitoring und Error Tracking konfigurieren

---

**Setup Zeit:** ~5 Minuten | **Status:** Production Ready ✅