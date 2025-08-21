"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star, TrendingUp, Clock } from "lucide-react";
import { MainDish, MainDishCardProps, ImageLoadState } from "./types";
import { formatPrice } from "@/lib/config";
import Image from "next/image";
import { useState } from "react";

// 🆕 DISH IMAGE COMPONENT with Error Handling
function DishImage({ dish, priority = false }: { dish: MainDish, priority?: boolean }) {
  const [imageState, setImageState] = useState<ImageLoadState>('loading');
  
  const handleImageLoad = () => setImageState('loaded');
  const handleImageError = () => setImageState('error');
  
  const showFallback = !dish.image || imageState === 'error';
  
  return (
    <div className="w-full md:w-40 h-32 md:h-28 flex-shrink-0 p-4 md:p-6">
      <div className="w-full h-full relative bg-muted/30 rounded-lg overflow-hidden border border-border/50">
        {showFallback ? (
          // Fallback: Emoji for appetite appeal
          <div className="w-full h-full flex items-center justify-center bg-muted/30">
            <span className="text-3xl md:text-4xl">🍔</span>
          </div>
        ) : (
          <Image
            src={dish.image!}
            alt={dish.imageAlt || dish.name}
            fill
            className="object-cover rounded-lg transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 160px"
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
      {/* 🆕 NEW: Flex container for Split Layout */}
      <div className="flex flex-col md:flex-row md:items-center">
        
        {/* 🆕 NEW: Image Section */}
        <DishImage dish={dish} priority={priority} />
        
        {/* EXISTING: Content Section - Structure preserved */}
        <CardContent className="flex-1 p-4 md:p-6">
        <div className="flex justify-between items-center gap-4">
          
          {/* Left: Dish Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <h3 className={cn(
                "font-semibold text-lg leading-tight group-hover:text-primary transition-colors pr-2",
                dish.isSignature && "text-accent",
                dish.isProfitable && "text-primary"
              )}>
                {dish.name}
              </h3>
              
              {/* Special Indicators */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {dish.isSignature && (
                  <Star className="h-4 w-4 fill-accent text-accent" />
                )}
                {dish.isProfitable && (
                  <TrendingUp className="h-4 w-4 text-primary" />
                )}
                {dish.available === false && (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
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
          </div>

          {/* Right: Price */}
          <div className="flex-shrink-0 text-right self-start md:self-center">
            <div className={cn(
              "text-2xl font-bold transition-colors",
              dish.isSignature && "text-accent",
              dish.isProfitable && "text-primary", 
              !dish.isSignature && !dish.isProfitable && "text-foreground group-hover:text-primary"
            )}>
              {formatPrice(dish.price)}
            </div>
            
            {/* Value indicator for profitable items */}
            {dish.isProfitable && (
              <div className="text-xs text-primary font-medium mt-1">
                Besonders beliebt
              </div>
            )}
          </div>
        </div>

        {/* Hover Effect: Show "Frisch vom Grill" */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-xs text-muted-foreground italic">
            🔥 Frisch auf dem Grill zubereitet
          </div>
        </div>
        </CardContent>
      </div>
    </Card>
  );
}

// Grid Layout for Main Dishes with Golden Triangle Psychology
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
    <div className="grid gap-4 md:gap-6 lg:gap-8">
      {/* Golden Triangle - First 4 items with priority loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {sortedDishes.slice(0, 4).map((dish, index) => (
          <MainDishCard
            key={dish.id}
            dish={dish}
            onDishClick={onDishClick}
            priority={index < 2} // First 2 get priority loading
          />
        ))}
      </div>
      
      {/* Remaining items - lazy loading */}
      {sortedDishes.length > 4 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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