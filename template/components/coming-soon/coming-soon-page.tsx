"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Clock, MapPin, Phone } from "lucide-react";

interface ComingSoonPageProps {
  className?: string;
}

export function ComingSoonPage({ className }: ComingSoonPageProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Entrance animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Static Image Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/images/hero/Burger_Grill.png')",
        }}
      />

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 z-10 bg-black/50" />

      {/* Content Layer */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4">
        <div className="text-center text-white max-w-2xl mx-auto">
          
          {/* Main Title */}
          <div className={cn(
            "transform transition-all duration-1000 delay-300",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}>
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight"
              style={{ 
                textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 8px 16px rgba(0,0,0,0.4)' 
              }}
            >
              <span className="block bg-black/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
                Coming Soon
              </span>
            </h1>
          </div>

          {/* Restaurant Name */}
          <div className={cn(
            "transform transition-all duration-1000 delay-500",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}>
            <h2 
              className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-4 text-amber-300"
              style={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.8)' 
              }}
            >
              Burgergrill Solothurn
            </h2>
          </div>

          {/* Subtitle */}
          <div className={cn(
            "transform transition-all duration-1000 delay-700",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}>
            <p 
              className="text-lg md:text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed"
              style={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.6)' 
              }}
            >
              <span className="block bg-black/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/5">
                Authentische Balkan-Küche • Bald für Sie da
              </span>
            </p>
          </div>

          {/* Status Indicator */}
          <div className={cn(
            "flex items-center justify-center gap-3 mb-8 transform transition-all duration-1000 delay-900",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}>
            <div className="flex items-center gap-2 text-white/80 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">Website in Vorbereitung</span>
            </div>
          </div>

          {/* Contact Info Preview */}
          <div className={cn(
            "grid gap-4 sm:grid-cols-2 max-w-lg mx-auto transform transition-all duration-1000 delay-1100",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}>
            <div className="flex items-center justify-center gap-2 text-white/70 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
              <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span>Solothurn</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-white/70 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
              <Phone className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span>Bald verfügbar</span>
            </div>
          </div>

          {/* Specialty Preview */}
          <div className={cn(
            "mt-12 transform transition-all duration-1000 delay-1300",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}>
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10 max-w-md mx-auto">
              <p className="text-white/80 text-sm font-medium mb-2">Freuen Sie sich auf:</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="bg-amber-500/20 text-amber-200 px-2 py-1 rounded-full">Čevapčići</span>
                <span className="bg-amber-500/20 text-amber-200 px-2 py-1 rounded-full">Burger</span>
                <span className="bg-amber-500/20 text-amber-200 px-2 py-1 rounded-full">Balkan-Würste</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility: Background description for screen readers */}
      <div className="sr-only">
        Hintergrundbild zeigt die Burgergrill Restaurant Ausstattung und Grillstation. 
        Die Coming Soon Seite kündigt die baldige Eröffnung des Burgergrill Restaurants in Solothurn an.
      </div>
    </div>
  );
}