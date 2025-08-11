"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { KgVerkaufProduct, KgVerkaufDialogProps, KgOrderData, SelectedProduct } from "./types";

// Authentische Balkan-Würste für KG-Verkauf
const PRODUCTS: KgVerkaufProduct[] = [
  {
    id: "wuerste-pikant",
    name: "Würste pikant",
    description: "Würzige Würste aus 100% Rind und Lamm - traditionell gewürzt",
    price: 32.00,
    unit: "kg",
    minOrder: 0.5,
    maxOrder: 10,
    available: true,
    preparationTime: "24h"
  },
  {
    id: "sucuk-mild",
    name: "Sucuk Mild",
    description: "Milde Sucuk aus 100% Rindfleisch - authentisch türkischer Stil",
    price: 38.00,
    unit: "kg", 
    minOrder: 0.5,
    maxOrder: 8,
    available: true,
    preparationTime: "24h"
  }
];

interface ProductSelection {
  [productId: string]: {
    selected: boolean;
    quantity: number;
  }
}

export function KgVerkaufDialog({ isOpen, onClose, onSubmit }: KgVerkaufDialogProps) {
  const [productSelections, setProductSelections] = useState<ProductSelection>({});
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [pickupDate, setPickupDate] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Calculate selected products
  const selectedProducts: SelectedProduct[] = PRODUCTS
    .filter(product => productSelections[product.id]?.selected)
    .map(product => ({
      product,
      quantity: productSelections[product.id]?.quantity || product.minOrder
    }));

  // Mindestdatum berechnen (24h Vorlauf)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split('T')[0];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Helper functions for product selection
  const handleProductToggle = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    setProductSelections(prev => ({
      ...prev,
      [productId]: {
        selected: !prev[productId]?.selected,
        quantity: prev[productId]?.quantity || product.minOrder
      }
    }));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setProductSelections(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0 || !customerName || !customerEmail || !customerPhone || !pickupDate) {
      return;
    }

    setIsSubmitting(true);

    const orderData: KgOrderData = {
      products: selectedProducts,
      customerName,
      customerEmail,
      customerPhone,
      pickupDate,
      specialRequests,
      totalPrice: 0 // No price calculation needed
    };

    try {
      await onSubmit(orderData);
      // Reset form
      setProductSelections({});
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setPickupDate("");
      setSpecialRequests("");
      onClose();
    } catch (error) {
      console.error("Order submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedProducts.length > 0 && 
    customerName && customerEmail && customerPhone && pickupDate &&
    selectedProducts.every(item => 
      item.quantity >= item.product.minOrder && 
      item.quantity <= item.product.maxOrder
    );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[500px] h-[95vh] max-h-[90vh] sm:h-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-accent">
            Balkan-Würste bestellen
          </DialogTitle>
          <DialogDescription>
            Authentische Würste für zu Hause. Mindestvorlauf 24 Stunden.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 -mr-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preis-Info Box */}
          <div className="bg-muted/50 border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">📋 Aktuelle Preise:</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              {PRODUCTS.map(product => (
                <div key={product.id} className="flex justify-between">
                  <span>• {product.name}:</span>
                  <span className="font-medium">{formatPrice(product.price)}/{product.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Produktauswahl */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Produkte auswählen (mehrere möglich)</Label>
            <div className="grid gap-4">
              {PRODUCTS.map(product => {
                const isSelected = productSelections[product.id]?.selected || false;
                const quantity = productSelections[product.id]?.quantity || product.minOrder;

                return (
                  <div
                    key={product.id}
                    className={cn(
                      "p-4 border rounded-lg transition-colors",
                      isSelected
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    )}
                  >
                    {/* Product Header */}
                    <label className="flex items-start space-x-3 cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleProductToggle(product.id)}
                        className="w-4 h-4 text-accent mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.description}</div>
                      </div>
                    </label>

                    {/* Quantity Input (only when selected) */}
                    {isSelected && (
                      <div className="flex items-center gap-3 mt-3 pl-7">
                        <Label htmlFor={`quantity-${product.id}`} className="text-sm">
                          Menge:
                        </Label>
                        <Input
                          id={`quantity-${product.id}`}
                          type="number"
                          min={product.minOrder}
                          max={product.maxOrder}
                          value={quantity}
                          onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">
                          {product.unit} ({product.minOrder}-{product.maxOrder})
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Pickup Reminder */}
          <div className="bg-accent/5 border border-accent/15 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-accent text-sm">📍</span>
              <span className="font-medium text-accent text-sm">Wichtiger Hinweis zur Abholung</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Persönliche Abholung an unserem Restaurant-Stand zu den Öffnungszeiten. 
              Bielstrasse 50, Solothurn (vor dem Conforama).
            </p>
          </div>

          {/* Kundendaten */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Kontaktdaten</Label>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ihr Name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+41 79 123 45 67"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ihre@email.ch"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Abholdatum */}
          <div className="space-y-2">
            <Label htmlFor="pickup-date" className="text-base font-semibold">
              Gewünschtes Abholdatum *
            </Label>
            <Input
              id="pickup-date"
              type="date"
              min={minDateString}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Mindestvorlauf 24 Stunden für frische Zubereitung
            </p>
          </div>

          {/* Spezielle Wünsche */}
          <div className="space-y-2">
            <Label htmlFor="special-requests" className="text-base font-semibold">
              Spezielle Wünsche (optional)
            </Label>
            <Textarea
              id="special-requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Besondere Wünsche oder Anmerkungen..."
              rows={3}
            />
          </div>
          </form>
        </div>

        <DialogFooter className="gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="bg-accent hover:bg-accent/90"
          >
            {isSubmitting ? "Wird gesendet..." : "Anfrage senden"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}