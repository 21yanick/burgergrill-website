# 🍔 Burgergrill One-Pager Konzept

**KISS-Prinzip**: Clean, Simple, No Over-Engineering

## 🎯 Projekt Overview

**Cevapcici-Grill One-Pager** mit Mini-Dashboard für Restaurant-Betreiber
- **Basis**: Next.js 15 + Supabase + Tailwind CSS (bereits implementiert)
- **Zielgruppe**: Schweizer Kunden, German Content, CHF Preise
- **Fokus**: Authentische Cevapcici & Burger, KG-Verkauf

## DB-Zugriff (Testserver)
- **Server:** `root@167.235.150.94`
- **DB Container:** `supabase-db-zkw8g48scw0sw0w8koo08wwg`
- **DB User:** `supabase_admin` / PW: `3fa2EPcbDl6mg4Wl940TXWoFtTfRo8rX`
- **Database:** `postgres` (leeres public Schema, nur auth-Tabellen vorhanden)


## 📱 One-Pager Struktur

```
🍔 HERO SECTION
├── Restaurant-Logo + Food-Hero-Image
├── "Authentische Cevapcici & Burger - Frisch gegrillt!"
└── [KG-VERKAUF BESTELLEN] [SPEISEKARTE ANSEHEN]

🥩 MENU SECTIONS  
├── Cevapcici-Burger (Signature Dishes)
├── Klassische Burger
├── Würste & Grillspezialitäten  
└── KG-Verkauf Dialog (Formular ohne Payment)

📍 LOCATION & HOURS
├── Adresse + Google Maps Embed
├── Öffnungszeiten (statisch, aus Dashboard editierbar)
└── Telefon + Email

👥 FOOTER
├── Kontakt-Info + Social Media
└── [Dashboard] Link (versteckt für Owner)
```

## 🎨 Farbkonzept

**Bordeaux-Rot Akzent** (Option 1)
```css
--accent: #8B0000        /* Bordeaux-Rot für CTAs, Highlights */
--primary: oklch(0.145 0 0)    /* Existing Dark */  
--background: oklch(1 0 0)     /* Existing White */
--muted: oklch(0.97 0 0)       /* Existing Light Gray */
```

**Features:**
- ✅ Dark/Light Mode Toggle (bereits implementiert)
- ✅ Elegant, Premium Feel
- ✅ Swiss Restaurant Aesthetic

## 🛠️ Dashboard (Mini-CMS)

**Authentication**: Existing System, Link im Footer

### Dashboard Sections:
```
/dashboard
├── Öffnungszeiten Editor
│   ├── Mo-So einzeln bearbeitbar
│   └── Live Preview der Website
├── Ferien/Geschlossen Manager
│   ├── Datum-Range Picker  
│   ├── Grund/Nachricht eingeben
│   └── Website-Banner automatisch
├── KG-Verkauf Bestellungen
│   ├── Eingehende Anfragen anzeigen
│   ├── Status-Updates (Neu/Bearbeitet/Abgeholt)
│   └── Kunden-Kontakt verwalten
└── Menu Management (Phase 2)
    ├── Items hinzufügen/bearbeiten
    └── Preise CHF verwalten
```

## 🗄️ Database Schema

### Neue Tabellen:
```sql
restaurant_settings {
  id, profile_id,
  business_name, address, phone,
  monday_open, monday_close, /* ... */,
  special_notice_text, special_notice_active
}

special_hours {
  id, profile_id, date,
  is_closed, custom_hours, reason
}

kg_orders {
  id, customer_name, email, phone,
  product, quantity_kg, pickup_date,
  status, notes, created_at
}

menu_categories { id, name, sort_order, active }
menu_items { 
  id, category_id, name, description,
  price_chf, image_url, available
}
```

## 🚀 Implementation Phasen

### Phase 1: One-Pager Foundation (1-2 Tage)
- [ ] Hero Section (Cevapcici-focused)
- [ ] Menu Display Components
- [ ] KG-Verkauf Dialog + Formular
- [ ] Location & Hours Section
- [ ] Bordeaux-Rot Farbschema

### Phase 2: Dashboard CMS (2-3 Tage)  
- [ ] Database Schema Update
- [ ] Öffnungszeiten Editor
- [ ] Ferien/Geschlossen Manager
- [ ] KG-Bestellungen Verwaltung

### Phase 3: Polish (1 Tag)
- [ ] SEO Optimization
- [ ] Mobile Responsiveness
- [ ] Performance Optimization

## ✨ Features

**Was BLEIBT (KISS):**
- ✅ Clean One-Page Design
- ✅ Simple Öffnungszeiten (kein Live-Status)
- ✅ KG-Verkauf ohne Payment
- ✅ Dashboard für Restaurant-Betreiber
- ✅ Swiss Localization (CHF, German)

**Was NICHT implementiert wird:**
- ❌ Live Öffnungszeiten-Status
- ❌ Parkplätze/ÖV im Footer
- ❌ Payment Integration
- ❌ Wetter Integration
- ❌ Over-Engineering Features

## 🔧 Technical Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth + Database)
- **Database**: PostgreSQL mit RLS
- **Email**: Resend (für KG-Bestellungen)
- **Deployment**: Vercel/Docker

---

**Ready to Build!** 🚀 Klares Konzept, fokussiert auf Essentials.