"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Phone, Clock, Star } from "lucide-react";
import { ContactCTAProps } from "./types";

export function ContactCTA({ kontakt }: ContactCTAProps) {
  const handleCallClick = () => {
    window.location.href = `tel:${kontakt.telefon.replace(/\s/g, '')}`;
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-accent via-accent to-primary text-accent-foreground shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4">
          <Star className="h-8 w-8" />
        </div>
        <div className="absolute top-4 right-4">
          <Phone className="h-8 w-8" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Clock className="h-6 w-6" />
        </div>
        <div className="absolute bottom-4 right-4">
          <Star className="h-6 w-6" />
        </div>
      </div>
      
      <CardContent className="relative p-8 text-center">
        <h3 className="text-2xl lg:text-3xl font-bold mb-2">
          {kontakt.vorbestellungText}:
        </h3>
        
        {/* Phone Number - Large and Clickable */}
        <Button
          onClick={handleCallClick}
          variant="secondary"
          size="lg"
          className={cn(
            "text-2xl lg:text-3xl font-bold py-6 px-8 mb-4",
            "bg-white text-accent hover:bg-white/90",
            "shadow-lg hover:shadow-xl transition-all duration-300",
            "hover:scale-105 active:scale-95"
          )}
        >
          <Phone className="mr-3 h-6 w-6" />
          {kontakt.telefon}
        </Button>
        
        {/* Benefits */}
        <div className="space-y-3 mb-6">
          <p className="text-lg opacity-90 font-medium">
            🔥 Bestellen Sie vor - wir bereiten alles frisch für Sie zu!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm opacity-80">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Keine Wartezeit</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Star className="h-4 w-4" />
              <span>Frisch zubereitet</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Einfache Bestellung</span>
            </div>
          </div>
        </div>
        
        {/* Opening Hours Hint */}
        <div className="p-4 bg-white/10 rounded-lg border border-white/20">
          <p className="text-sm opacity-90">
            💡 <strong>Tipp:</strong> Rufen Sie am besten 15-20 Minuten vor Abholung an
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for sticky/floating placement
export function CompactContactCTA({ kontakt }: ContactCTAProps) {
  const handleCallClick = () => {
    window.location.href = `tel:${kontakt.telefon.replace(/\s/g, '')}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <Button
        onClick={handleCallClick}
        size="lg"
        className={cn(
          "rounded-full shadow-lg hover:shadow-xl",
          "bg-accent hover:bg-accent/90 text-accent-foreground",
          "animate-pulse hover:animate-none",
          "transition-all duration-300"
        )}
      >
        <Phone className="h-5 w-5 mr-2" />
        <span className="font-semibold">Anrufen</span>
      </Button>
    </div>
  );
}