/**
 * 📝 PRODUCT EDITOR COMPONENT
 * Individual product editor for KG-Verkauf products
 * 
 * Features:
 * - Price editing with validation
 * - Min/Max order quantity controls
 * - Availability toggle with reason
 * - Description editing
 * - Real-time validation feedback
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Package,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

import type { KgProduct } from '@/lib/restaurant/actions/kg-products';

// =====================================================================================
// TYPES & CONSTANTS
// =====================================================================================

interface ProductEditorProps {
  product: KgProduct;
  onUpdate: (updates: Partial<KgProduct>) => void;
  onToggleAvailability: (available: boolean, reason?: string) => void;
}

// Validation rules
const VALIDATION_RULES = {
  name: { minLength: 2, maxLength: 50 },
  price: { min: 0.01, max: 999.99 },
  min_order: { min: 0.01, max: 100 },
  max_order: { min: 0.01, max: 999 },
  description: { minLength: 10, maxLength: 200 },
} as const;

// Valid unit options
const UNIT_OPTIONS = [
  { value: 'kg', label: 'Kilogramm', display: 'kg' },
  { value: 'pack', label: 'Packung', display: 'pack' },
  { value: 'stk', label: 'Stück', display: 'stk' },
] as const;

// =====================================================================================
// PRODUCT EDITOR COMPONENT
// =====================================================================================

export function ProductEditor({ product, onUpdate, onToggleAvailability }: ProductEditorProps) {
  const [unavailableReason, setUnavailableReason] = useState(
    product.unavailable_reason || 'Vorübergehend nicht verfügbar'
  );

  // Validation helpers
  const validatePrice = useCallback((price: number): string | null => {
    if (isNaN(price) || price < VALIDATION_RULES.price.min) {
      return 'Preis muss mindestens 0.01 CHF sein';
    }
    if (price > VALIDATION_RULES.price.max) {
      return 'Preis darf höchstens 999.99 CHF sein';
    }
    return null;
  }, []);

  const validateOrder = useCallback((min: number, max: number): string | null => {
    if (isNaN(min) || min < VALIDATION_RULES.min_order.min) {
      return 'Mindestbestellung muss mindestens 0.01 sein';
    }
    if (isNaN(max) || max < VALIDATION_RULES.max_order.min) {
      return 'Maximalbestellung muss mindestens 0.01 sein';
    }
    if (max < min) {
      return 'Maximalbestellung muss größer als Mindestbestellung sein';
    }
    return null;
  }, []);

  const validateDescription = useCallback((desc: string): string | null => {
    if (desc.length < VALIDATION_RULES.description.minLength) {
      return `Beschreibung muss mindestens ${VALIDATION_RULES.description.minLength} Zeichen haben`;
    }
    if (desc.length > VALIDATION_RULES.description.maxLength) {
      return `Beschreibung darf höchstens ${VALIDATION_RULES.description.maxLength} Zeichen haben`;
    }
    return null;
  }, []);

  const validateName = useCallback((name: string): string | null => {
    if (!name || name.trim().length < VALIDATION_RULES.name.minLength) {
      return `Name muss mindestens ${VALIDATION_RULES.name.minLength} Zeichen haben`;
    }
    if (name.length > VALIDATION_RULES.name.maxLength) {
      return `Name darf höchstens ${VALIDATION_RULES.name.maxLength} Zeichen haben`;
    }
    return null;
  }, []);

  const validateUnit = useCallback((unit: string): string | null => {
    const validUnits = UNIT_OPTIONS.map(opt => opt.value);
    if (!validUnits.includes(unit as any)) {
      return 'Bitte wählen Sie eine gültige Einheit';
    }
    return null;
  }, []);

  // Event handlers
  const handlePriceChange = useCallback((value: string) => {
    const price = parseFloat(value) || 0;
    onUpdate({ price });
  }, [onUpdate]);

  const handleMinOrderChange = useCallback((value: string) => {
    const min_order = parseFloat(value) || 0;
    onUpdate({ min_order });
  }, [onUpdate]);

  const handleMaxOrderChange = useCallback((value: string) => {
    const max_order = parseFloat(value) || 0;
    onUpdate({ max_order });
  }, [onUpdate]);

  const handleDescriptionChange = useCallback((value: string) => {
    onUpdate({ description: value });
  }, [onUpdate]);

  const handleNameChange = useCallback((value: string) => {
    onUpdate({ name: value });
  }, [onUpdate]);

  const handleUnitChange = useCallback((value: string) => {
    onUpdate({ unit: value });
  }, [onUpdate]);

  const handleAvailabilityToggle = useCallback((available: boolean) => {
    onToggleAvailability(available, available ? undefined : unavailableReason);
  }, [onToggleAvailability, unavailableReason]);

  // Get validation errors
  const nameError = validateName(product.name);
  const priceError = validatePrice(product.price);
  const orderError = validateOrder(product.min_order, product.max_order);
  const descriptionError = validateDescription(product.description);
  const unitError = validateUnit(product.unit);
  const hasErrors = !!(nameError || priceError || orderError || descriptionError || unitError);

  return (
    <Card className={cn(
      "transition-all duration-200",
      !product.available && "opacity-75 bg-muted/30"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              product.available 
                ? "bg-green-100 text-green-700" 
                : "bg-gray-100 text-gray-500"
            )}>
              <Package className="w-5 h-5" />
            </div>
            
            <div className="flex-1">
              <div className="mb-2">
                <Input
                  value={product.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={cn(
                    "text-lg font-semibold bg-transparent border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0",
                    nameError && "text-red-600"
                  )}
                  placeholder="Produktname"
                />
                {nameError && (
                  <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    {nameError}
                  </div>
                )}
              </div>
              <CardDescription className="flex items-center gap-2">
                <span>ID: {product.product_id}</span>
                <span>•</span>
                <Badge 
                  variant={product.available ? "default" : "secondary"}
                  className={cn(
                    product.available 
                      ? "bg-green-100 text-green-700 hover:bg-green-200" 
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  )}
                >
                  {product.available ? "Verfügbar" : "Nicht verfügbar"}
                </Badge>
              </CardDescription>
            </div>
          </div>

          {/* Availability Toggle */}
          <Button
            variant={product.available ? "default" : "secondary"}
            size="sm"
            onClick={() => handleAvailabilityToggle(!product.available)}
            className={cn(
              "gap-2 transition-all",
              product.available 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            )}
          >
            {product.available ? (
              <>
                <Eye className="w-4 h-4" />
                Verfügbar
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                Nicht verfügbar
              </>
            )}
          </Button>
        </div>

        {/* Unavailable Reason */}
        {!product.available && product.unavailable_reason && (
          <div className="mt-2 p-2 rounded bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">
              <span className="font-medium">Grund:</span> {product.unavailable_reason}
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div>
          <Label htmlFor={`description-${product.id}`} className="text-sm font-medium">
            Beschreibung
          </Label>
          <Textarea
            id={`description-${product.id}`}
            value={product.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className={cn(
              "mt-1.5 min-h-[60px]",
              descriptionError && "border-red-300 focus:border-red-300 focus:ring-red-200"
            )}
            placeholder="Produktbeschreibung..."
          />
          {descriptionError && (
            <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="w-3 h-3" />
              {descriptionError}
            </div>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {product.description.length} / {VALIDATION_RULES.description.maxLength} Zeichen
          </p>
        </div>

        {/* Price & Unit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`price-${product.id}`} className="text-sm font-medium">
              Preis (CHF)
            </Label>
            <div className="relative mt-1.5">
              <Input
                id={`price-${product.id}`}
                type="number"
                min="0.01"
                max="999.99"
                step="0.01"
                value={product.price.toFixed(2)}
                onChange={(e) => handlePriceChange(e.target.value)}
                className={cn(
                  "pr-16",
                  priceError && "border-red-300 focus:border-red-300 focus:ring-red-200"
                )}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-sm text-muted-foreground">
                  / {product.unit}
                </span>
              </div>
            </div>
            {priceError && (
              <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-3 h-3" />
                {priceError}
              </div>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium">Einheit</Label>
            <div className="mt-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 w-full justify-between",
                      unitError && "border-red-300 focus:border-red-300 focus:ring-red-200"
                    )}
                  >
                    {UNIT_OPTIONS.find(opt => opt.value === product.unit)?.label || 'Einheit wählen'}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {UNIT_OPTIONS.map(option => (
                    <DropdownMenuItem 
                      key={option.value} 
                      onClick={() => handleUnitChange(option.value)}
                    >
                      {option.label} ({option.display})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {unitError && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  {unitError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Quantities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`min-order-${product.id}`} className="text-sm font-medium">
              Mindestbestellung
            </Label>
            <div className="relative mt-1.5">
              <Input
                id={`min-order-${product.id}`}
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                value={product.min_order.toString()}
                onChange={(e) => handleMinOrderChange(e.target.value)}
                className={cn(
                  "pr-12",
                  orderError && "border-red-300 focus:border-red-300 focus:ring-red-200"
                )}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-sm text-muted-foreground">
                  {product.unit}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor={`max-order-${product.id}`} className="text-sm font-medium">
              Maximalbestellung
            </Label>
            <div className="relative mt-1.5">
              <Input
                id={`max-order-${product.id}`}
                type="number"
                min="0.01"
                max="999"
                step="0.01"
                value={product.max_order.toString()}
                onChange={(e) => handleMaxOrderChange(e.target.value)}
                className={cn(
                  "pr-12",
                  orderError && "border-red-300 focus:border-red-300 focus:ring-red-200"
                )}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-sm text-muted-foreground">
                  {product.unit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {orderError && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="w-3 h-3" />
            {orderError}
          </div>
        )}

        {/* Unavailable Reason Input */}
        {!product.available && (
          <div>
            <Label htmlFor={`reason-${product.id}`} className="text-sm font-medium">
              Grund für Nichtverfügbarkeit (optional)
            </Label>
            <Input
              id={`reason-${product.id}`}
              value={unavailableReason}
              onChange={(e) => setUnavailableReason(e.target.value)}
              className="mt-1.5"
              placeholder="z.B. Ausverkauft bis Montag"
            />
          </div>
        )}

        {/* Validation Status */}
        {!hasErrors && (
          <div className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle className="w-3 h-3" />
            Alle Eingaben sind gültig
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =====================================================================================
// EXPORT
// =====================================================================================

export default ProductEditor;