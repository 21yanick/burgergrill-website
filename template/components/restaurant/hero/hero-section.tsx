"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VideoHeroBackground } from "./video-hero-background";
import { ModernHeroContent } from "./modern-hero-content";
import { ModernHeroProps } from "./types";
import { KgVerkaufDialog } from "../kg-verkauf/kg-verkauf-dialog";
import { KgOrderData } from "../kg-verkauf/types";

// Modern Burgergrill content - focused and classy
const createDefaultHeroContent = (onOrderClick: () => void) => ({
  title: "Balkan-Grill in Solothurn",
  subtitle: "Traditionelle Cevapcici & saftige Burger - frisch vom Grill für Sie zubereitet.",
  primaryCTA: {
    text: "Jetzt bestellen",
    onClick: onOrderClick,
    icon: "ShoppingCart"
  },
  secondaryCTA: {
    text: "Speisekarte ansehen", 
    href: "#menu",
    icon: "ArrowRight"
  }
});

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
  content, 
  video = defaultVideoSettings,
  showVideo = true,
  overlayOpacity = 0.45,
  className 
}: ModernHeroProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOrderSubmit = async (orderData: KgOrderData) => {
    // TODO: Implement Resend email integration for order notifications
    // - Send order confirmation to customer
    // - Send order notification to restaurant
    // - Use template from lib/email/templates/
    console.log("New Grillfleisch-Verkauf order from hero:", orderData);
    
    // Create summary of ordered products
    const productSummary = orderData.products
      .map(item => `${item.quantity} ${item.product.unit} ${item.product.name}`)
      .join(', ');
    
    // For now, just log and show success
    alert(`Vielen Dank für Ihre Anfrage, ${orderData.customerName}!\n\nBestellung: ${productSummary}\nGesamtpreis: ${orderData.totalPrice.toFixed(2)} CHF\n\nWir melden uns innerhalb von 24 Stunden bei Ihnen.`);
  };

  const finalContent = content || createDefaultHeroContent(() => setIsDialogOpen(true));
  
  // Fallback for when video is disabled
  if (!showVideo) {
    return (
      <>
        <section className={cn(
          "min-h-screen flex items-center bg-gradient-to-br from-primary via-accent to-primary/80",
          className
        )}>
          <ModernHeroContent
            title={finalContent.title}
            subtitle={finalContent.subtitle}
            ctas={{
              primaryCTA: finalContent.primaryCTA,
              secondaryCTA: finalContent.secondaryCTA
            }}
          />
        </section>
        
        {/* KG-Verkauf Dialog */}
        <KgVerkaufDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleOrderSubmit}
        />
      </>
    );
  }

  return (
    <>
      <section className={cn("relative", className)}>
        <VideoHeroBackground
          videoSrc={video.src}
          fallbackImage={video.fallbackImage}
          overlayOpacity={overlayOpacity}
        >
          <ModernHeroContent
            title={finalContent.title}
            subtitle={finalContent.subtitle}
            ctas={{
              primaryCTA: finalContent.primaryCTA,
              secondaryCTA: finalContent.secondaryCTA
            }}
          />
        </VideoHeroBackground>
      </section>
      
      {/* KG-Verkauf Dialog */}
      <KgVerkaufDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleOrderSubmit}
      />
    </>
  );
}