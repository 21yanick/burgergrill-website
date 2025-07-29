"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MenuCategory, CategoryTabProps } from "./types";
import { categoryLabels, categoryIcons } from "./menu-data";

export function CategoryTabs({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryTabProps) {
  
  const scrollToCategory = (category: MenuCategory) => {
    onCategoryChange(category);
    
    // Smooth scroll to category section with proper offset calculation
    const element = document.getElementById(`category-${category}`);
    if (element) {
      // Dynamic header offset: transparent header (80px) + category tabs (68px) + padding (16px)
      const headerOffset = 164; // Total: 164px to match scroll-mt-32 (128px) + extra buffer
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    // Desktop-only Category Navigation - Mobile users scroll naturally through menu
    <div className="hidden md:block sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-4">
        
        {/* Desktop: Equal-width distributed tabs */}
        <div className="flex justify-center">
          <div className="grid grid-cols-4 gap-3 w-full max-w-2xl">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "ghost"}
                onClick={() => scrollToCategory(category)}
                className={cn(
                  "h-12 text-sm font-medium transition-all",
                  "hover:scale-105 active:scale-95",
                  activeCategory === category && [
                    "bg-primary text-primary-foreground",
                    "shadow-lg ring-2 ring-primary/20",
                    "border-accent/20"
                  ],
                  activeCategory !== category && [
                    "hover:bg-primary/10 hover:text-primary",
                    "text-muted-foreground hover:shadow-md"
                  ]
                )}
              >
                <span className="mr-2 text-lg">
                  {categoryIcons[category]}
                </span>
                <span className="font-semibold">
                  {categoryLabels[category]}
                </span>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Visual Indicator for Active Tab - Desktop only */}
        <div className="flex justify-center mt-3">
          <div className="flex gap-1.5">
            {categories.map((category) => (
              <div
                key={`indicator-${category}`}
                className={cn(
                  "w-2 h-1 rounded-full transition-all duration-300",
                  activeCategory === category 
                    ? "bg-primary scale-125" 
                    : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for robust scroll-based active category detection using Intersection Observer
export function useActiveCategory(categories: MenuCategory[]) {
  const [activeCategory, setActiveCategory] = React.useState<MenuCategory>(categories[0]);

  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Trigger when section is 20% from top
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the entry that's most visible (highest intersectionRatio)
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      
      if (visibleEntries.length > 0) {
        // Sort by intersection ratio and take the most visible one
        const mostVisible = visibleEntries.sort((a, b) => 
          b.intersectionRatio - a.intersectionRatio
        )[0];
        
        // Extract category from element ID
        const categoryId = mostVisible.target.id.replace('category-', '') as MenuCategory;
        if (categories.includes(categoryId)) {
          setActiveCategory(categoryId);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all category sections
    categories.forEach(category => {
      const element = document.getElementById(`category-${category}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [categories]);

  return [activeCategory, setActiveCategory] as const;
}