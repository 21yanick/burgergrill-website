"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star, TrendingUp, Clock } from "lucide-react";
import { MainDish, MainDishCardProps } from "./types";
import { formatPrice } from "@/lib/config";

export function MainDishCard({ dish, onDishClick }: MainDishCardProps) {
  const handleClick = () => {
    if (dish.available !== false) {
      onDishClick?.(dish);
    }
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300",
        "hover:shadow-lg hover:scale-[1.02] hover:ring-2 hover:ring-primary/20",
        
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
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4">
          
          {/* Left: Dish Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className={cn(
                "font-semibold text-lg leading-tight group-hover:text-primary transition-colors",
                dish.isSignature && "text-accent",
                dish.isProfitable && "text-primary"
              )}>
                {dish.name}
              </h3>
              
              {/* Special Indicators */}
              <div className="flex items-center gap-1 ml-2">
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
          <div className="flex-shrink-0 text-right">
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
      {/* Special grid for first 4 items (Golden Triangle area) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {sortedDishes.slice(0, 4).map((dish) => (
          <MainDishCard
            key={dish.id}
            dish={dish}
            onDishClick={onDishClick}
          />
        ))}
      </div>
      
      {/* Remaining items in standard grid */}
      {sortedDishes.length > 4 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sortedDishes.slice(4).map((dish) => (
            <MainDishCard
              key={dish.id}
              dish={dish}
              onDishClick={onDishClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}