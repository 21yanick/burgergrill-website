"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { MenuItemProps } from "./types";

export function MenuItem({ item, onItemClick, showImage = true }: MenuItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
        !item.available && "opacity-60 cursor-not-allowed",
        item.isSignature && "ring-2 ring-accent/20 hover:ring-accent/40"
      )}
      onClick={() => item.available && onItemClick?.(item)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Item Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className={cn(
                  "font-semibold text-lg leading-tight",
                  item.isSignature && "text-accent"
                )}>
                  {item.name}
                </h3>
                {item.isSignature && (
                  <Star className="h-4 w-4 fill-accent text-accent" />
                )}
              </div>
              <div className="text-right">
                {!item.available && (
                  <Badge variant="secondary" className="text-xs">
                    Ausverkauft
                  </Badge>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>

            {/* Allergens */}
            {item.allergens && item.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {item.allergens.map((allergen) => (
                  <Badge 
                    key={allergen} 
                    variant="outline" 
                    className="text-xs px-2 py-0.5"
                  >
                    {allergen}
                  </Badge>
                ))}
              </div>
            )}

            {/* Signature Badge */}
            {item.isSignature && (
              <Badge className="bg-accent/10 text-accent border-accent/20 w-fit">
                Signature Gericht
              </Badge>
            )}
          </div>

          {/* Item Image */}
          {showImage && item.image && (
            <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}