"use client";

import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, BookOpen, Package } from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { HeroCTAProps, HeroContent } from './types';

interface ModernHeroContentProps {
  title: string;
  subtitle: string;
  ctas: HeroCTAProps;
  className?: string;
}

// Clean icon mapping system
const getCtaIcon = (iconName?: string, className?: string) => {
  const iconClasses = className || "h-4 md:h-5 w-4 md:w-5";
  
  switch (iconName) {
    case 'ShoppingCart':
      return <ShoppingCart className={iconClasses} />;
    case 'BookOpen':
      return <BookOpen className={iconClasses} />;
    case 'Package':
      return <Package className={iconClasses} />;
    case 'ArrowRight':
      return <ArrowRight className={iconClasses} />;
    default:
      return <ArrowRight className={iconClasses} />;
  }
};

// Unified CTA rendering logic
type CTAType = HeroContent['primaryCTA'] | HeroContent['secondaryCTA'];

interface RenderCTAProps {
  cta: CTAType;
  variant?: 'default' | 'outline';
  className?: string;
  iconPosition?: 'left' | 'right';
}

const renderCTA = ({ cta, variant = 'default', className, iconPosition = 'left' }: RenderCTAProps) => {
  const isClickAction = 'onClick' in cta;
  const icon = getCtaIcon(cta.icon, iconPosition === 'left' ? "mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" : "ml-2 md:ml-3 h-4 md:h-5 w-4 md:w-5");
  
  const content = (
    <>
      {iconPosition === 'left' && icon}
      {cta.text}
      {iconPosition === 'right' && icon}
    </>
  );

  if (isClickAction) {
    return (
      <Button 
        onClick={cta.onClick}
        variant={variant}
        size="lg" 
        className={className}
      >
        {content}
      </Button>
    );
  }
  
  return (
    <Button 
      asChild 
      variant={variant}
      size="lg" 
      className={className}
    >
      <Link href={cta.href}>
        {content}
      </Link>
    </Button>
  );
};

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
        

        {/* Main Title - Enhanced Typography with Two Lines */}
        <h1 className={cn(
          "text-3xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight transform transition-all duration-1000 delay-300",
          "tracking-tight md:tracking-wide drop-shadow-2xl",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
        style={{ 
          textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.15)'
        }}>
          <span className="block bg-black/5 backdrop-blur-sm rounded-2xl px-4 py-3 md:px-8 md:py-4 border border-white/10">
            {title.split('|').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < title.split('|').length - 1 && <br />}
              </React.Fragment>
            ))}
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
            Für unsere Kunden legen wir die Hand ins Feuer 😉
          </span>
          <span className="hidden md:block bg-black/5 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/5">
            {subtitle}
          </span>
        </p>

        {/* Quality Indicators - Clean and focused */}
        <div className={cn(
          "flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 mb-8 md:mb-12 transform transition-all duration-1000 delay-700",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          {/* Focused quality indicators */}
          <div className="flex items-center gap-2 text-white/90 bg-black/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <div className="w-2 h-2 bg-accent rounded-full shadow-sm"></div>
            <span className="text-sm font-medium tracking-wide">Frisch auf dem Grill</span>
          </div>
          <div className="flex items-center gap-2 text-white/90 bg-black/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <div className="w-2 h-2 bg-accent rounded-full shadow-sm"></div>
            <span className="text-sm font-medium tracking-wide">Höchste Qualität</span>
          </div>
          {/* KG pickup focus */}
          <div className="flex items-center gap-2 text-white/90 bg-black/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <div className="w-2 h-2 bg-accent rounded-full shadow-sm"></div>
            <span className="text-sm font-medium tracking-wide">KG-weise Abholung</span>
          </div>
        </div>

        {/* Modern CTA Buttons - Clean unified system */}
        <div className={cn(
          "flex flex-col gap-3 md:flex-row md:gap-4 justify-center transform transition-all duration-1000 delay-900",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}>
          {/* Primary CTA - Prominent accent styling */}
          {renderCTA({
            cta: ctas.primaryCTA,
            variant: 'default',
            className: cn(
              "bg-accent hover:bg-accent/90 text-accent-foreground",
              "h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold",
              "shadow-xl hover:shadow-2xl",
              "transform hover:scale-105 transition-all duration-300",
              "ring-2 ring-accent/20 hover:ring-accent/40"
            ),
            iconPosition: 'left'
          })}

          {/* Secondary CTA - Elegant outline styling */}
          {renderCTA({
            cta: ctas.secondaryCTA,
            variant: 'outline',
            className: cn(
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
            ),
            iconPosition: 'right'
          })}
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