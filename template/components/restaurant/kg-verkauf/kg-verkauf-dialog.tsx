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
import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { KgVerkaufProduct, KgVerkaufDialogProps, KgOrderData, SelectedProduct, dbArrayToFrontend } from "./types";
import { getAvailableKgProducts } from "@/lib/restaurant/actions/kg-products";

interface ProductSelection {
  [productId: string]: {
    selected: boolean;
    quantity: number;
  }
}

export function KgVerkaufDialog({ isOpen, onClose, onSubmit }: KgVerkaufDialogProps) {
  // Product data state (dynamic from database)
  const [products, setProducts] = useState<KgVerkaufProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  
  // Form state
  const [productSelections, setProductSelections] = useState<ProductSelection>({});
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [pickupDate, setPickupDate] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load products from database
  useEffect(() => {
    if (isOpen && products.length === 0) {
      loadProducts();
    }
  }, [isOpen, products.length]);

  const loadProducts = async () => {
    try {
      setIsLoadingProducts(true);
      setProductsError(null);
      
      const dbProducts = await getAvailableKgProducts();
      const frontendProducts = dbArrayToFrontend(dbProducts);
      
      setProducts(frontendProducts);
    } catch (error) {
      console.error('Failed to load KG products:', error);
      setProductsError('Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Calculate selected products
  const selectedProducts: SelectedProduct[] = products
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

  const formatUnit = (unit: string) => {
    switch(unit) {
      case 'pack': return '6er Pack';
      case 'kg': return 'kg';
      case 'stk': return 'Stück';
      default: return unit;
    }
  };

  // Helper functions for product selection
  const handleProductToggle = (productId: string) => {
    const product = products.find(p => p.id === productId);
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
      totalPrice: 0 // Price calculated at pickup - no online payment
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
            Würste bestellen
          </DialogTitle>
          <DialogDescription>
            Authentische Würste für zu Hause. Mindestvorlauf 24 Stunden.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 -mr-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Loading State */}
          {isLoadingProducts && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Lade Produkte...</span>
            </div>
          )}

          {/* Error State */}
          {productsError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {productsError}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadProducts}
                  className="ml-2"
                >
                  Erneut versuchen
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Main Form - only show when products are loaded */}
          {!isLoadingProducts && !productsError && products.length > 0 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Preis-Info Box */}
          <div className="bg-muted/50 border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">📋 Aktuelle Preise:</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              {products.map(product => (
                <div key={product.id} className="flex justify-between">
                  <span>• {product.name}:</span>
                  <span className="font-medium">{formatPrice(product.price)}/{formatUnit(product.unit)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Produktauswahl */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Produkte auswählen (mehrere möglich)</Label>
            <div className="grid gap-4">
              {products.map(product => {
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
                          {formatUnit(product.unit)} ({product.minOrder}-{product.maxOrder})
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
              Persönliche Abholung an unserem Imbiss-Stand zu den Öffnungszeiten. 
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
          )}

          {/* No Products State */}
          {!isLoadingProducts && !productsError && products.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Aktuell sind keine Produkte verfügbar.
              </p>
              <Button variant="outline" onClick={loadProducts}>
                Erneut laden
              </Button>
            </div>
          )}
        </div>

        {/* Footer - only show when products are available */}
        {!isLoadingProducts && !productsError && products.length > 0 && (
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
        )}

        {/* Footer for error/loading states */}
        {(isLoadingProducts || productsError || products.length === 0) && (
          <DialogFooter className="gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Schließen
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}