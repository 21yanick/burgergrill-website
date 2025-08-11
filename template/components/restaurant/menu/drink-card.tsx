"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Droplets, Sparkles } from "lucide-react";
import { DrinkCardProps } from "./types";
import { formatPrice } from "@/lib/config";

export function DrinkCard({ drinks }: DrinkCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-500">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5" />
      
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Droplets className="h-8 w-8 text-accent" />
      </div>
      
      <CardContent className="relative p-8 text-center">
        {/* Title */}
        <h3 className="text-2xl lg:text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
          {drinks.title}
        </h3>
        
        {/* Price - Large and Prominent */}
        <div className="mb-4">
          <div className="text-4xl lg:text-5xl font-bold text-primary mb-1">
            {formatPrice(drinks.price)}
          </div>
          <Badge 
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 font-medium"
          >
            Einheitspreis für alle Getränke
          </Badge>
        </div>
        
        {/* Description */}
        <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
          {drinks.description}
        </p>
        
        {/* Available Drinks Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Coca Cola', 'Cola Zero', 'Redbull', 'Redbull Zero', 'Icetea Lemon', 'Ayran', 'Evian'].map((drink) => (
            <div
              key={drink}
              className="p-2 bg-background/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors text-sm font-medium"
            >
              {drink}
            </div>
          ))}
        </div>
        
        {/* Value Proposition */}
        <div className="mt-6 p-4 bg-background/30 rounded-lg border border-accent/20">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Droplets className="h-4 w-4 text-accent" />
            <span>Erfrischend kalt serviert</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Extended Drink Section - Clean and minimal
export function DrinkSection({ drinks }: DrinkCardProps) {
  return (
    <div className="space-y-6">
      <DrinkCard drinks={drinks} />
    </div>
  );
}