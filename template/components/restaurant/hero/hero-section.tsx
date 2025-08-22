"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VideoHeroBackground } from "./video-hero-background";
import { ModernHeroContent } from "./modern-hero-content";
import { ModernHeroProps } from "./types";
import { KgVerkaufDialog } from "../kg-verkauf/kg-verkauf-dialog";
import { KgOrderData } from "../kg-verkauf/types";

// Modern Burgergrill content - Premium meat focus with clear pickup messaging
const createDefaultHeroContent = (onOrderClick: () => void) => ({
  title: "Burger Grill Solothurn|100% Rind & Kalbsfleisch",
  subtitle: "Für unsere Kunden legen wir die Hand ins Feuer 😉",
  primaryCTA: {
    text: "Speisekarte ansehen",
    href: "#menu",
    icon: "BookOpen"
  },
  secondaryCTA: {
    text: "Würste abholen", 
    onClick: onOrderClick,
    icon: "Package"
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
    try {
      console.log("New Würste order from hero:", orderData);
      
      // Send order emails via API route (Server-Side Infomaniak SMTP)
      const response = await fetch('/api/send-order-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderData,
          orderSource: 'hero'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API Error:', result);
        if (result.details) {
          alert(`Bestelldaten sind unvollständig:\n${result.details.join('\n')}`);
        } else {
          alert('Ein Fehler ist beim E-Mail-Versand aufgetreten. Bitte versuchen Sie es erneut.');
        }
        return;
      }

      console.log('Email sending results:', {
        confirmationSent: result.confirmationSent,
        notificationSent: result.notificationSent,
        orderNumber: result.orderNumber,
        errors: result.errors,
        productSummary: result.productSummary
      });
      
      // Show appropriate feedback to user
      if (result.confirmationSent && result.notificationSent) {
        alert(`Bestellung erfolgreich aufgegeben!\n\nBestellnummer: ${result.orderNumber}\n\nWir haben Ihnen eine Bestätigungsmail gesendet und bereiten Ihre Bestellung vor:\n${result.productSummary}`);
      } else if (result.confirmationSent) {
        alert(`Bestellung aufgegeben! Bestätigungsmail wurde gesendet.\n\nBestellnummer: ${result.orderNumber}\n\nHinweis: Restaurant-Benachrichtigung konnte nicht gesendet werden. Wir werden Sie kontaktieren.`);
      } else if (result.notificationSent) {
        alert(`Bestellung aufgegeben! Restaurant wurde benachrichtigt.\n\nBestellnummer: ${result.orderNumber}\n\nHinweis: Bestätigungsmail konnte nicht gesendet werden.`);
      } else {
        alert(`Bestellung aufgegeben, aber E-Mails konnten nicht gesendet werden.\n\nBestellnummer: ${result.orderNumber}\n\nWir werden Sie telefonisch kontaktieren: ${orderData.customerPhone}`);
      }
      
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.');
    }
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