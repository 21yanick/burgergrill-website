# 🎬 Hero Video Optimierung Guide - Mobile-Enhanced

## Problem: Video zu groß (31.4 MB → Ziel: Desktop 3-5 MB, Mobile 1-2 MB)

### Option 1: Online Tools (Einfach)

1. **Veed.io** (Empfohlen für Anfänger):
   - Gehe zu: https://www.veed.io/compress-video
   - Upload `Cevape_videoo.mp4`
   - **Desktop**: "Web optimized" → Target: 3-4 MB
   - **Mobile**: "Mobile optimized" → Target: 1-2 MB
   - Erstelle beide Versionen

2. **HandBrake** (Kostenlos, mehr Kontrolle):
   - Download: https://handbrake.fr/
   - **Desktop**: Preset "Web" → "Vimeo YouTube HQ 720p30"
   - **Mobile**: Preset "Web" → "Vimeo YouTube 720p30" 
   - Audio: "None" (entfernen)
   - Quality: RF 26 (Desktop) / RF 30 (Mobile)

### Option 2: FFmpeg (Professionell) - Mobile-First

```bash
# Installation (Mac):
brew install ffmpeg

# Installation (Ubuntu/Debian):
sudo apt update && sudo apt install ffmpeg

# Desktop Version (1280x720):
ffmpeg -i public/videos/hero/Cevape_video.mp4 \
  -vf "scale=1280:720" \
  -c:v libx264 -crf 26 \
  -preset medium \
  -movflags +faststart \
  -an \
  public/videos/hero/Cevape_video_optimized.mp4

# Mobile Version (750x540) - Optimiert für Mobile:
ffmpeg -i public/videos/hero/Cevape_video.mp4 \
  -vf "scale=750:540" \
  -c:v libx264 -crf 30 \
  -preset medium \
  -movflags +faststart \
  -an \
  public/videos/hero/Cevape_video_mobile.mp4

# Desktop WebM (beste Compression):
ffmpeg -i public/videos/hero/Cevape_video.mp4 \
  -vf "scale=1280:720" \
  -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -an \
  public/videos/hero/Cevape_video.webm

# Mobile WebM (ultra-compressed):
ffmpeg -i public/videos/hero/Cevape_video.mp4 \
  -vf "scale=750:540" \
  -c:v libvpx-vp9 -crf 35 -b:v 0 \
  -an \
  public/videos/hero/Cevape_video_mobile.webm
```

### Option 3: Professionelle Services

- **Cloudinary**: Automatische Video-Optimierung
- **ImageKit**: Video-Transformation API
- **AWS MediaConvert**: Batch-Processing

## Erwartete Resultate:

- **Vor**: 31.4 MB 
- **Desktop Nach**: 3-4 MB (88% Reduktion)
- **Mobile Nach**: 1-2 MB (94% Reduktion)
- **Ladezeit Desktop**: Von 30+ Sekunden auf 3-4 Sekunden
- **Ladezeit Mobile**: Von 30+ Sekunden auf 1-2 Sekunden
- **Qualität**: Visuell kaum Unterschied, Mobile-optimiert

## Implementierung:

1. Optimiere das Video mit einer der obigen Methoden
2. Platziere optimierte Dateien in `/public/videos/hero/`
3. Der Code lädt automatisch die beste verfügbare Version:
   **Mobile-First Loading:**
   - `Cevape_video_mobile.webm` (Mobile, beste Compression)
   - `Cevape_video_mobile.mp4` (Mobile, Fallback)
   - `Cevape_video.webm` (Desktop, beste Compression)
   - `Cevape_video_optimized.mp4` (Desktop, Fallback)
   - `Cevape_video.mp4` (Original als letzte Option)

## Performance Features bereits implementiert:

✅ Mobile Video Support (mit Performance-Optimierungen)
✅ Connection-Aware Loading (verzögert bei schlechter Verbindung)
✅ Responsive Video Sources (Desktop 1280x720, Mobile 750x540)
✅ Lazy Loading (lädt nur wenn sichtbar)
✅ Smart Preloading (metadata auf Mobile, none auf Desktop)
✅ Error Handling (Fallback bei Fehlern)
✅ Multiple Format Support (WebM → MP4)
✅ Intersection Observer (optimierte Performance)

## Nächste Schritte:

1. **Sofort**: Video mit Online-Tool komprimieren
2. **Optional**: FFmpeg für perfekte Kontrolle
3. **Future**: CDN für globale Auslieferung (Cloudflare, AWS)