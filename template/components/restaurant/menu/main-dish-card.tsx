"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star, TrendingUp, Clock } from "lucide-react";
import { MainDish, MainDishCardProps, ImageLoadState } from "./types";
import { formatPrice } from "@/lib/config";
import Image from "next/image";
import { useState } from "react";

// ✅ CLEAN DISH IMAGE COMPONENT - ULTRATHINK DESIGN
function DishImage({ dish, priority = false }: { dish: MainDish, priority?: boolean }) {
  const [imageState, setImageState] = useState<ImageLoadState>('loading');
  
  const handleImageLoad = () => setImageState('loaded');
  const handleImageError = () => setImageState('error');
  
  const showFallback = !dish.image || imageState === 'error';
  
  return (
    <div className="w-full sm:w-28 h-28 flex-shrink-0 p-3">
      <div className="w-full h-full relative bg-muted/30 rounded-lg overflow-hidden border border-border/50">
        {showFallback ? (
          // Fallback: Emoji for appetite appeal
          <div className="w-full h-full flex items-center justify-center bg-muted/30">
            <span className="text-3xl">🍔</span>
          </div>
        ) : (
          <Image
            src={dish.image!}
            alt={dish.imageAlt || dish.name}
            fill
            className="object-cover rounded-lg transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 112px"
            priority={priority}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        {/* Loading State */}
        {imageState === 'loading' && dish.image && (
          <div className="absolute inset-0 bg-muted/50 animate-pulse rounded-lg" />
        )}
      </div>
    </div>
  );
}

export function MainDishCard({ dish, onDishClick, priority = false }: MainDishCardProps) {
  const handleClick = () => {
    if (dish.available !== false) {
      onDishClick?.(dish);
    }
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 overflow-hidden",
        "hover:shadow-lg hover:scale-[1.01] hover:ring-2 hover:ring-primary/20",
        
        // Signature items - Burgundy accent for authenticity
        dish.isSignature && [
          "ring-2 ring-accent/30 bg-accent/5",
          "border-accent/40",
          "hover:ring-accent/50 hover:bg-accent/10"
        ],
        
        // Profitable items - Primary border for attention
        dish.isProfitable && [
          "ring-2 ring-primary/30 bg-primary/5", 
          "border-primary/40",
          "hover:ring-primary/50 hover:bg-primary/10"
        ],
        
        // Unavailable state
        dish.available === false && [
          "opacity-60 cursor-not-allowed",
          "hover:shadow-none hover:scale-100 hover:ring-0"
        ]
      )}
      onClick={handleClick}
    >
      {/* ✅ CLEAN LAYOUT STRUCTURE - ULTRATHINK DESIGN */}
      <div className="flex flex-col sm:flex-row gap-4">
        
        {/* Image Section - Clean, predictable sizing */}
        <DishImage dish={dish} priority={priority} />
        
        {/* Content Section - CLEAN VERTICAL STRUCTURE with CENTERING */}
        <CardContent className="flex-1 p-4 lg:p-6 flex items-center">
          <div className="space-y-3">
            
            {/* Title */}
            <h3 className={cn(
              "font-semibold text-lg leading-tight group-hover:text-primary transition-colors",
              dish.isSignature && "text-accent",
              dish.isProfitable && "text-primary"
            )}>
              {dish.name}
            </h3>
            
            {/* Price + Indicators - ALWAYS VISIBLE */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "text-2xl font-bold transition-colors",
                dish.isSignature && "text-accent",
                dish.isProfitable && "text-primary", 
                !dish.isSignature && !dish.isProfitable && "text-foreground group-hover:text-primary"
              )}>
                {formatPrice(dish.price)}
              </div>
              
              {/* Special Indicators inline with price */}
              {dish.isSignature && (
                <Star className="h-5 w-5 fill-accent text-accent" />
              )}
              {dish.isProfitable && (
                <TrendingUp className="h-5 w-5 text-primary" />
              )}
              {dish.available === false && (
                <Clock className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            {/* Special Badges */}
            <div className="flex flex-wrap gap-2">
              {dish.isSignature && (
                <Badge 
                  variant="secondary"
                  className="bg-accent/10 text-accent border-accent/20 text-xs font-medium"
                >
                  Spezialität
                </Badge>
              )}
              
              {dish.isProfitable && (
                <Badge 
                  variant="secondary" 
                  className="bg-primary/10 text-primary border-primary/20 text-xs font-medium"
                >
                  Beliebter Mix
                </Badge>
              )}
              
              {dish.available === false && (
                <Badge variant="outline" className="text-xs">
                  Momentan nicht verfügbar
                </Badge>
              )}
            </div>

            {/* Hover Effect */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-xs text-muted-foreground italic">
                🔥 Frisch vom Grill
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// ✅ CLEAN GRID LAYOUT - ULTRATHINK DESIGN
export function MainDishGrid({ dishes, onDishClick }: { 
  dishes: MainDish[], 
  onDishClick?: (dish: MainDish) => void 
}) {
  // Sort for Golden Triangle: Signature + Profitable first, then by name
  const sortedDishes = [...dishes].sort((a, b) => {
    // Priority order: Signature > Profitable > Standard
    const getPriority = (dish: MainDish) => {
      if (dish.isSignature) return 3;
      if (dish.isProfitable) return 2;
      return 1;
    };
    
    const priorityDiff = getPriority(b) - getPriority(a);
    if (priorityDiff !== 0) return priorityDiff;
    
    // Within same priority, sort alphabetically
    return a.name.localeCompare(b.name, 'de-CH');
  });

  return (
    <div className="space-y-8">
      {/* Golden Triangle - First 4 items (Priority) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
        {sortedDishes.slice(0, 4).map((dish, index) => (
          <MainDishCard
            key={dish.id}
            dish={dish}
            onDishClick={onDishClick}
            priority={index < 2} // First 2 get priority loading
          />
        ))}
      </div>
      
      {/* Remaining items - PROFESSIONAL: Max 2 columns for price visibility */}
      {sortedDishes.length > 4 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {sortedDishes.slice(4).map((dish) => (
            <MainDishCard
              key={dish.id}
              dish={dish}
              onDishClick={onDishClick}
              priority={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}