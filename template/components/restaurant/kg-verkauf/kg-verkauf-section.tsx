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
    try {
      console.log("New Balkan-Würste order:", orderData);
      
      // Send order emails via API route (Server-Side Infomaniak SMTP)
      const response = await fetch('/api/send-order-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderData,
          orderSource: 'kg-verkauf-section'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API Error:', result);
        if (result.details) {
          alert(`Bestelldaten sind unvollständig:\n${result.details.join('\n')}`);
        } else {
          alert('Ein Fehler ist beim E-Mail-Versand aufgetreten. Bitte versuchen Sie es erneut.');
        }
        return;
      }

      console.log('Email sending results:', {
        confirmationSent: result.confirmationSent,
        notificationSent: result.notificationSent,
        orderNumber: result.orderNumber,
        errors: result.errors,
        productSummary: result.productSummary
      });
      
      // Show appropriate feedback to user
      if (result.confirmationSent && result.notificationSent) {
        alert(`Bestellung erfolgreich aufgegeben!\n\nBestellnummer: ${result.orderNumber}\n\nWir haben Ihnen eine Bestätigungsmail gesendet und bereiten Ihre Bestellung vor:\n${result.productSummary}\n\nGesamtpreis: ${orderData.totalPrice.toFixed(2)} CHF`);
      } else if (result.confirmationSent) {
        alert(`Bestellung aufgegeben! Bestätigungsmail wurde gesendet.\n\nBestellnummer: ${result.orderNumber}\n\nHinweis: Restaurant-Benachrichtigung konnte nicht gesendet werden. Wir werden Sie kontaktieren.\n\nBestellung: ${result.productSummary}`);
      } else if (result.notificationSent) {
        alert(`Bestellung aufgegeben! Restaurant wurde benachrichtigt.\n\nBestellnummer: ${result.orderNumber}\n\nHinweis: Bestätigungsmail konnte nicht gesendet werden.\n\nBestellung: ${result.productSummary}`);
      } else {
        alert(`Bestellung aufgegeben, aber E-Mails konnten nicht gesendet werden.\n\nBestellnummer: ${result.orderNumber}\n\nWir werden Sie telefonisch kontaktieren: ${orderData.customerPhone}\n\nBestellung: ${result.productSummary}`);
      }
      
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.');
    }
  };

  return (
    <>
      <section id="wurst-verkauf" className={cn("py-20 lg:py-32 bg-muted/30", className)}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Würste für zu Hause
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Unsere authentischen Würste auch kilogrammweise für Ihre Grillparty oder Event. 
                Würzige Würste aus 100% Rind und Lamm sowie milde Sucuk aus bestem Rindfleisch.
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
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <div className="space-y-3 text-center">
                  <h4 className="font-semibold text-accent text-lg">🌭 Würste pikant</h4>
                  <p className="text-sm text-muted-foreground">
                    Würzige Würste aus 100% Rind und Lamm
                  </p>
                  <p className="text-xs text-muted-foreground">Kilogrammweise verfügbar</p>
                </div>
                
                <div className="space-y-3 text-center">
                  <h4 className="font-semibold text-accent text-lg">🥩 Sucuk Mild</h4>
                  <p className="text-sm text-muted-foreground">
                    Milde Sucuk aus 100% Rindfleisch
                  </p>
                  <p className="text-xs text-muted-foreground">Kilogrammweise verfügbar</p>
                </div>
              </div>
            </div>

            {/* Pickup Information - Important Notice */}
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mt-1 shrink-0">
                  <span className="text-accent text-lg">🕐</span>
                </div>
                <div>
                  <h4 className="font-semibold text-accent mb-2">Abholung & Öffnungszeiten</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Persönliche Abholung an unserem Imbiss-Stand zu den{" "}
                    <a 
                      href="#location" 
                      className="text-accent hover:text-accent/80 underline font-medium"
                    >
                      Öffnungszeiten
                    </a>
                    . Bielstrasse 50, Solothurn (vor dem Conforama).
                  </p>
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
              Jetzt Würste bestellen
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