"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { KgVerkaufDialog } from "./kg-verkauf-dialog";
import { KgOrderData } from "./types";
import { cn } from "@/lib/utils";

interface KgVerkaufSectionProps {
  className?: string;
}

export function KgVerkaufSection({ className }: KgVerkaufSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOrderSubmit = async (orderData: KgOrderData) => {
    // TODO: Implement email sending logic
    console.log("New KG-Verkauf order:", orderData);
    
    // Here we would typically:
    // 1. Send email to restaurant
    // 2. Store order in database
    // 3. Send confirmation email to customer
    
    // Create summary of ordered products
    const productSummary = orderData.products
      .map(item => `${item.quantity} ${item.product.unit} ${item.product.name}`)
      .join(', ');
    
    // For now, just log and show success
    alert(`Vielen Dank für Ihre Anfrage, ${orderData.customerName}!\n\nBestellung: ${productSummary}\nGesamtpreis: ${orderData.totalPrice.toFixed(2)} CHF\n\nWir melden uns innerhalb von 24 Stunden bei Ihnen.`);
  };

  return (
    <>
      <section id="kg-verkauf" className={cn("py-20 lg:py-32 bg-muted/30", className)}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                KG-Verkauf für zu Hause
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Unsere frischen Spezialitäten auch kilogrammweise für Ihre Grillparty oder Event. 
                Handgemachte Cevapcici, saftige Burger-Patties und traditionelle Würste.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Frisch zubereitet</h3>
                <p className="text-muted-foreground text-sm">
                  Alle Produkte werden frisch nach Ihrer Bestellung hergestellt
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🥩</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Premium Qualität</h3>
                <p className="text-muted-foreground text-sm">
                  Nur beste Zutaten und traditionelle Rezepte
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">24h Vorlauf</h3>
                <p className="text-muted-foreground text-sm">
                  Bestellen Sie mindestens einen Tag im Voraus
                </p>
              </div>
            </div>

            {/* Products Overview */}
            <div className="bg-background border rounded-xl p-8 mb-8">
              <h3 className="text-xl font-bold mb-6">Verfügbare Produkte</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">🥩 Cevapcici</h4>
                  <p className="text-sm text-muted-foreground">
                    Handgemacht nach traditionellem Rezept
                  </p>
                  <p className="text-xs text-muted-foreground">Kilogrammweise verfügbar</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">🍔 Burger Patties</h4>
                  <p className="text-sm text-muted-foreground">
                    Premium Rindfleisch-Patties
                  </p>
                  <p className="text-xs text-muted-foreground">Kilogrammweise verfügbar</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">🌭 Würste</h4>
                  <p className="text-sm text-muted-foreground">
                    Traditionelle Bratwürste
                  </p>
                  <p className="text-xs text-muted-foreground">Stückweise verfügbar</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              onClick={() => setIsDialogOpen(true)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Jetzt KG-Verkauf bestellen
            </Button>
          </div>
        </div>
      </section>

      {/* Dialog */}
      <KgVerkaufDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleOrderSubmit}
      />
    </>
  );
}