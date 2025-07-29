"use client";

import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ShoppingCart, Phone, Star } from 'lucide-react';
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
        
        {/* Premium Badge - Hidden on Mobile for cleaner look */}
        <div className={cn(
          "mb-4 md:mb-6 transform transition-all duration-1000 delay-200 hidden md:block",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          <Badge 
            variant="secondary" 
            className="bg-white/10 text-white border-white/20 backdrop-blur-sm text-sm font-medium px-4 py-2"
          >
            <Star className="w-4 h-4 mr-2 text-yellow-400 fill-yellow-400" />
            Schweizer Grill-Tradition seit Jahren
          </Badge>
        </div>

        {/* Main Title - Responsive sizing */}
        <h1 className={cn(
          "text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight transform transition-all duration-1000 delay-300",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}>
          <span className="block">
            {title}
          </span>
        </h1>

        {/* Subtitle - Shorter on mobile */}
        <p className={cn(
          "text-base md:text-xl lg:text-2xl mb-6 md:mb-8 leading-relaxed max-w-3xl mx-auto transform transition-all duration-1000 delay-500",
          "text-white/90 font-light",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}>
          <span className="block md:hidden">
            Frisch gegrillte Cevapcici, saftige Burger und erstklassige Spezialitäten.
          </span>
          <span className="hidden md:block">
            {subtitle}
          </span>
        </p>

        {/* Premium Quality Indicators - Simplified on mobile */}
        <div className={cn(
          "flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-6 md:mb-10 transform transition-all duration-1000 delay-700",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          {/* Mobile: Only show 2 most important indicators */}
          <div className="flex items-center gap-2 text-white/80">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-sm font-medium">100% Rind & Kalbsfleisch</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-sm font-medium">Frisch auf dem Grill</span>
          </div>
          {/* Third indicator only on desktop */}
          <div className="hidden sm:flex items-center gap-2 text-white/80">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-sm font-medium">Schweizer Qualität</span>
          </div>
        </div>

        {/* Modern CTA Buttons - Simplified on mobile */}
        <div className={cn(
          "flex flex-col gap-3 md:flex-row md:gap-4 justify-center transform transition-all duration-1000 delay-900",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}>
          {/* Primary CTA - Prominent */}
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

        {/* Contact CTA - Hidden on mobile for cleaner look */}  
        <div className={cn(
          "mt-6 md:mt-8 transform transition-all duration-1000 delay-1100 hidden md:block",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          <Link 
            href="tel:079 489 77 55"
            className={cn(
              "inline-flex items-center gap-2 text-white/70 hover:text-white",
              "text-sm font-medium transition-colors duration-300",
              "hover:underline underline-offset-4"
            )}
          >
            <Phone className="w-4 h-4" />
            <span>Direktbestellung: 079 489 77 55</span>
          </Link>
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