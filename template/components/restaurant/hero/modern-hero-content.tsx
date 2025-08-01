"use client";

import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { HeroCTAProps } from './types';

interface ModernHeroContentProps {
  title: string;
  subtitle: string;
  ctas: HeroCTAProps;
  className?: string;
}

export function ModernHeroContent({ title, subtitle, ctas, className }: ModernHeroContentProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Entrance animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("container mx-auto px-4 pt-24 md:pt-8", className)}>
      <div className="max-w-4xl mx-auto text-center text-white">
        

        {/* Main Title - Enhanced Typography */}
        <h1 className={cn(
          "text-3xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight transform transition-all duration-1000 delay-300",
          "tracking-tight md:tracking-wide drop-shadow-2xl",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
        style={{ 
          textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.15)'
        }}>
          <span className="block bg-black/5 backdrop-blur-sm rounded-2xl px-4 py-3 md:px-8 md:py-4 border border-white/10">
            {title}
          </span>
        </h1>

        {/* Subtitle - Enhanced Readability */}
        <p className={cn(
          "text-base md:text-xl lg:text-2xl mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto transform transition-all duration-1000 delay-500",
          "text-white/95 font-light tracking-wide drop-shadow-lg",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
        style={{ 
          textShadow: '0 2px 4px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2)'
        }}>
          <span className="block md:hidden bg-black/5 backdrop-blur-sm rounded-xl px-3 py-2">
            Traditionelle Cevapcici, saftige Burger & leckere Hot Dog.
          </span>
          <span className="hidden md:block bg-black/5 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/5">
            {subtitle}
          </span>
        </p>

        {/* Premium Quality Indicators - Enhanced Design */}
        <div className={cn(
          "flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 mb-8 md:mb-12 transform transition-all duration-1000 delay-700",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          {/* Enhanced indicators with backdrop */}
          <div className="flex items-center gap-2 text-white/90 bg-black/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <div className="w-2 h-2 bg-accent rounded-full shadow-sm"></div>
            <span className="text-sm font-medium tracking-wide">100% Rind & Kalbsfleisch</span>
          </div>
          <div className="flex items-center gap-2 text-white/90 bg-black/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <div className="w-2 h-2 bg-accent rounded-full shadow-sm"></div>
            <span className="text-sm font-medium tracking-wide">Frisch auf dem Grill</span>
          </div>
          {/* Third indicator only on desktop */}
          <div className="hidden sm:flex items-center gap-2 text-white/90 bg-black/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <div className="w-2 h-2 bg-accent rounded-full shadow-sm"></div>
            <span className="text-sm font-medium tracking-wide">Schweizer Qualität</span>
          </div>
        </div>

        {/* Modern CTA Buttons - Simplified on mobile */}
        <div className={cn(
          "flex flex-col gap-3 md:flex-row md:gap-4 justify-center transform transition-all duration-1000 delay-900",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}>
          {/* Primary CTA - Prominent */}
          {'onClick' in ctas.primaryCTA ? (
            <Button 
              onClick={ctas.primaryCTA.onClick}
              size="lg" 
              className={cn(
                "bg-accent hover:bg-accent/90 text-accent-foreground",
                "h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold",
                "shadow-xl hover:shadow-2xl",
                "transform hover:scale-105 transition-all duration-300",
                "ring-2 ring-accent/20 hover:ring-accent/40"
              )}
            >
              <ShoppingCart className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" />
              {ctas.primaryCTA.text}
            </Button>
          ) : (
            <Button 
              asChild 
              size="lg" 
              className={cn(
                "bg-accent hover:bg-accent/90 text-accent-foreground",
                "h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold",
                "shadow-xl hover:shadow-2xl",
                "transform hover:scale-105 transition-all duration-300",
                "ring-2 ring-accent/20 hover:ring-accent/40"
              )}
            >
              <Link href={ctas.primaryCTA.href}>
                <ShoppingCart className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" />
                {ctas.primaryCTA.text}
              </Link>
            </Button>
          )}

          {/* Secondary CTA - Universal Readability */}
          <Button 
            variant="outline" 
            size="lg" 
            asChild
            className={cn(
              // Universal readability - works on any background
              "bg-white/15 text-white border-white/40",
              "hover:bg-white/25 hover:text-white hover:border-white/60",
              // Ensure text is always readable with backdrop
              "backdrop-blur-md shadow-lg",
              // Enhanced contrast ring for definition
              "ring-1 ring-black/20 hover:ring-black/30",
              // Mobile-optimized sizing
              "h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold",
              "transform hover:scale-105 transition-all duration-300"
            )}
          >
            <Link href={ctas.secondaryCTA.href}>
              {ctas.secondaryCTA.text}
              <ArrowRight className="ml-2 md:ml-3 h-4 md:h-5 w-4 md:w-5" />
            </Link>
          </Button>
        </div>

        {/* Scroll Indicator - Desktop only */}
        <div className={cn(
          "absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1300 hidden md:block",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          <div className="flex flex-col items-center gap-2 text-white/50">
            <span className="text-xs font-medium">Entdecken Sie mehr</span>
            <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}