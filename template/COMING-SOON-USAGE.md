# 🚀 Coming Soon Mode - Usage Guide

## 📋 Überblick
Professionelles Coming Soon System für Burgergrill Website mit Video-Background und Environment Variable Toggle.

## ⚡ Schnellstart

### Coming Soon Mode aktivieren:
```bash
# WICHTIG: NEXT_PUBLIC_ Prefix für Production erforderlich!
# In .env.local oder Coolify Environment Variables:
NEXT_PUBLIC_SHOW_COMING_SOON=true
```

### Coming Soon Mode deaktivieren:
```bash
# In .env.local oder Coolify Environment Variables:
NEXT_PUBLIC_SHOW_COMING_SOON=false
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

### Dateien erstellt:
- `components/coming-soon/coming-soon-page.tsx` - Hauptkomponente
- `components/coming-soon/index.ts` - Export
- Aktualisiert: `app/(marketing)/page.tsx` - Environment Variable Logic
- Aktualisiert: `app/layout.tsx` - **Header/Footer Suppression**
- Aktualisiert: `.env.example` - Dokumentation

### Environment Variable Logic:
```typescript
// app/layout.tsx - Header/Footer Suppression
const isComingSoon = process.env.NEXT_PUBLIC_SHOW_COMING_SOON === 'true';
{isComingSoon ? (
  <div className="min-h-screen">{children}</div>
) : (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)}

// app/(marketing)/page.tsx - Page Content Toggle
if (process.env.NEXT_PUBLIC_SHOW_COMING_SOON === 'true') {
  return <ComingSoonPage />
}
```

## 🚀 Deployment

### Staging/Testing:
```bash
NEXT_PUBLIC_SHOW_COMING_SOON=true pnpm build
```

### Production Launch (Coolify):
```bash
# Coming Soon aktivieren
NEXT_PUBLIC_SHOW_COMING_SOON=true

# Später: Full Website aktivieren  
NEXT_PUBLIC_SHOW_COMING_SOON=false
```

## ⚠️ Wichtige Hinweise

1. **Image File**: Stellt sicher, dass `Burger_Grill.png` existiert
2. **Environment**: Nur `'true'` (String) aktiviert Coming Soon Mode - **NEXT_PUBLIC_ Prefix erforderlich!**
3. **Simple & Fast**: Statisches Bild lädt sofort ohne Komplexität
4. **No Navigation**: Coming Soon Page hat keine Header/Footer
5. **TypeScript**: Alle Komponenten sind fully typed

## 🎯 Use Cases

- **Pre-Launch**: Website ankündigen vor offiziellem Launch
- **Maintenance**: Während größerer Updates
- **Event**: Für spezielle Ankündigungen
- **Testing**: A/B Testing mit echter Coming Soon Seite