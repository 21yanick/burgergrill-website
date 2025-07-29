"use client";

import { cn } from "@/lib/utils";
import { VideoHeroBackground } from "./video-hero-background";
import { ModernHeroContent } from "./modern-hero-content";
import { ModernHeroProps } from "./types";

// Modern Burgergrill content - focused and classy
const defaultModernHeroContent = {
  title: "Authentischer Grill-Geschmack",
  subtitle: "Frisch gegrillte Cevapcici, saftige Burger und erstklassige Spezialitäten - erleben Sie echte Schweizer Grill-Tradition mit jedem Bissen.",
  primaryCTA: {
    text: "Jetzt bestellen",
    href: "#kg-verkauf",
    icon: "ShoppingCart"
  },
  secondaryCTA: {
    text: "Speisekarte ansehen", 
    href: "#menu",
    icon: "ArrowRight"
  }
};

// Default video settings optimized for restaurant
const defaultVideoSettings = {
  src: "/videos/hero/Cevape_video.mp4",
  fallbackImage: "", // CSS-based fallback used instead
  autoplay: true,
  muted: true,
  loop: true,
  controls: false,
  preload: 'metadata' as const
};

export function HeroSection({ 
  content = defaultModernHeroContent, 
  video = defaultVideoSettings,
  showVideo = true,
  overlayOpacity = 0.45,
  className 
}: ModernHeroProps) {
  
  // Fallback for when video is disabled
  if (!showVideo) {
    return (
      <section className={cn(
        "min-h-screen flex items-center bg-gradient-to-br from-primary via-accent to-primary/80",
        className
      )}>
        <ModernHeroContent
          title={content.title}
          subtitle={content.subtitle}
          ctas={{
            primaryCTA: content.primaryCTA,
            secondaryCTA: content.secondaryCTA
          }}
        />
      </section>
    );
  }

  return (
    <section className={cn("relative", className)}>
      <VideoHeroBackground
        videoSrc={video.src}
        fallbackImage={video.fallbackImage}
        overlayOpacity={overlayOpacity}
      >
        <ModernHeroContent
          title={content.title}
          subtitle={content.subtitle}
          ctas={{
            primaryCTA: content.primaryCTA,
            secondaryCTA: content.secondaryCTA
          }}
        />
      </VideoHeroBackground>
    </section>
  );
}