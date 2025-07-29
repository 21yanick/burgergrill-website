# 🚀 Coming Soon Mode - Usage Guide

## 📋 Überblick
Professionelles Coming Soon System für Burgergrill Website mit Video-Background und Environment Variable Toggle.

## ⚡ Schnellstart

### Coming Soon Mode aktivieren:
```bash
# Server-Side Environment Variable (Runtime-Zugriff)
# In .env.local oder Coolify Environment Variables:
SHOW_COMING_SOON=true
```

### Coming Soon Mode deaktivieren:
```bash
# In .env.local oder Coolify Environment Variables:
SHOW_COMING_SOON=false
# oder Variable komplett weglassen
```

## 🎯 Features

### ✅ Static Image Background
- Verwendet `Burger_Grill.png` als Hintergrundbild
- Einfaches, schnell ladendes statisches Bild
- Optimiert für alle Geräte und Verbindungen

### ✅ Responsive Design
- Vollständig responsive für alle Geräte
- Optimierte Schriftgrößen und Spacing
- Touch-friendly für Mobile

### ✅ Performance Features
- Instant Loading - Kein Video Loading erforderlich
- Optimierte Animationen mit CSS Transitions
- Minimaler JavaScript Code für beste Performance

### ✅ Clean Layout
- **NO Header/Footer** in Coming Soon Mode
- Environment Variable Layout Suppression
- Fullscreen Video Experience

### ✅ Accessibility
- Screen Reader Support
- Semantic HTML Structure
- Keyboard Navigation Ready

## 🎨 Design Features

### Animationen
- Smooth Entrance Animations (staggered)
- CSS Backdrop-blur Effects
- Professional Typography with Text-shadow

### Content Elemente
- Haupttitel: "Coming Soon"
- Restaurant Name: "Burgergrill Solothurn"  
- Subtitle: "Authentische Balkan-Küche • Bald für Sie da"
- Status Indicator: "Website in Vorbereitung"
- Contact Preview: Solothurn, "Bald verfügbar"
- Specialty Tags: Čevapčići, Burger, Grillfleisch-Verkauf

## 🔧 Technische Details

### Dateien erstellt/aktualisiert:
- `components/coming-soon/coming-soon-page.tsx` - Hauptkomponente
- `components/coming-soon/index.ts` - Export
- Aktualisiert: `app/(marketing)/page.tsx` - Page-Level Logic + Debug-Logging
- Aktualisiert: `app/layout.tsx` - **Header/Footer Suppression**
- **NEU**: `middleware.ts` - **Robuste Middleware-Lösung**
- **NEU**: `app/coming-soon-internal/page.tsx` - Interne Coming Soon Route
- **NEU**: `app/coming-soon-internal/layout.tsx` - Clean Layout ohne Header/Footer
- Aktualisiert: `.env.example` - Dokumentation

### Environment Variable Logic:
```typescript
// app/layout.tsx - Header/Footer Suppression (Server-Side)
const isComingSoon = process.env.SHOW_COMING_SOON === 'true';
{isComingSoon ? (
  <div className="min-h-screen">{children}</div>
) : (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)}

// app/(marketing)/page.tsx - Page Content Toggle (Server-Side)
if (process.env.SHOW_COMING_SOON === 'true') {
  return <ComingSoonPage />
}
```

## 🚀 Deployment

### Staging/Testing:
```bash
SHOW_COMING_SOON=true pnpm build
```

### Production Launch (Coolify):
```bash
# Coming Soon aktivieren - KEIN Rebuild erforderlich!
SHOW_COMING_SOON=true

# Später: Full Website aktivieren - KEIN Rebuild erforderlich!  
SHOW_COMING_SOON=false
```

## ⚠️ Wichtige Hinweise

1. **Image File**: Stellt sicher, dass `Burger_Grill.png` existiert
2. **Environment**: Nur `'true'` (String) aktiviert Coming Soon Mode - **Server-Side Runtime-Zugriff**
3. **Simple & Fast**: Statisches Bild lädt sofort ohne Komplexität
4. **No Navigation**: Coming Soon Page hat keine Header/Footer
5. **TypeScript**: Alle Komponenten sind fully typed

## 🔧 Robuste Middleware-Lösung implementiert

**Problem**: Next.js Caching und Build-Time Issues
- Page-basierte Environment Variable Checks werden gecached
- Server Components können statisch generiert werden  
- Unpredictable Production Behavior

**Lösung**: Middleware-basierte Coming Soon (GARANTIERT funktionsfähig)
- **Middleware**: Läuft bei JEDER Request
- **Kein Caching**: Wird nie gecached, immer fresh
- **Runtime Environment**: Variables zur Runtime gelesen
- **Rewrite-basiert**: Interne Route ohne URL-Änderung
- **Debug-Logging**: Vollständige Transparenz in Production

**Dual-Approach**: Page-Level + Middleware für maximale Zuverlässigkeit

## 🎯 Use Cases

- **Pre-Launch**: Website ankündigen vor offiziellem Launch
- **Maintenance**: Während größerer Updates
- **Event**: Für spezielle Ankündigungen
- **Testing**: A/B Testing mit echter Coming Soon Seite