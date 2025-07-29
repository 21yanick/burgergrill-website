"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/theme";
import { cn } from "@/lib/utils";

// Modern transparent header with glassmorphism - 2025 design
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection for dynamic header behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        // Base positioning and layering
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500",
        // Glassmorphism effect - completely transparent by default
        "backdrop-blur-md",
        // Dynamic background based on scroll
        isScrolled 
          ? "bg-background/90 border-b border-border/50 shadow-lg" 
          : "bg-transparent border-b border-transparent"
      )}
    >
      <Container>
        <div className={cn(
          "flex items-center justify-between transition-all duration-300",
          // Dynamic height - compact when scrolled
          isScrolled ? "h-14" : "h-20"
        )}>
          
          {/* Burgergrill Logo - Prominent left placement */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className={cn(
                "flex items-center transition-all duration-300 hover:scale-105",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg"
              )}
            >
              <div className="relative">
                <Image
                  src="/images/header/Burgergrill_Logo.png"
                  alt="Burgergrill - Frisch vom Grill"
                  width={isScrolled ? 140 : 180}
                  height={isScrolled ? 35 : 45}
                  className="transition-all duration-300 drop-shadow-md"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Theme Toggle - Subtle right placement */}
          <div className="flex items-center">
            <div className={cn(
              // Glassmorphism container for theme toggle
              "rounded-full p-1 transition-all duration-300",
              // Enhanced visibility on scroll
              isScrolled 
                ? "bg-background/50 backdrop-blur-sm border border-border/30" 
                : "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
            )}>
              <ThemeToggle 
                className={cn(
                  "transition-colors duration-300",
                  // Ensure readability on all backgrounds
                  !isScrolled && "text-white hover:text-white/80"
                )}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Subtle gradient overlay for enhanced text readability */}
      {!isScrolled && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent pointer-events-none" />
      )}
    </header>
  );
}