/**
 * 🛒 KG-PRODUCTS MANAGER COMPONENT
 * Draft-mode editor for KG-Verkauf products
 * 
 * Features:
 * - Draft state system - changes saved only on "Save" button
 * - Individual product editing with price/availability controls
 * - Simple save/cancel functionality
 * - Real-time validation
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ShoppingCart, 
  Save, 
  X,
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { ProductEditor } from './product-editor';
import { getAllKgProducts, updateKgProduct, toggleProductAvailability } from '@/lib/restaurant/actions/kg-products';
import type { KgProduct } from '@/lib/restaurant/actions/kg-products';

// =====================================================================================
// TYPES & CONSTANTS
// =====================================================================================

interface KgProductsManagerProps {
  className?: string;
}

type DraftProduct = KgProduct;
type DraftState = Record<string, DraftProduct>; // keyed by product id

// =====================================================================================
// KG-PRODUCTS MANAGER COMPONENT
// =====================================================================================

export function KgProductsManager({ className }: KgProductsManagerProps) {
  // State management
  const [originalProducts, setOriginalProducts] = useState<KgProduct[]>([]);
  const [draftState, setDraftState] = useState<DraftState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Load all products from database
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const products = await getAllKgProducts();
      setOriginalProducts(products);
      
      // Initialize draft state from loaded products
      const initialDraft: DraftState = {};
      products.forEach(product => {
        initialDraft[product.id] = { ...product };
      });
      setDraftState(initialDraft);
      
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Fehler beim Laden der Produkte. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update single product in draft state
  const updateDraftProduct = useCallback((productId: string, updates: Partial<KgProduct>) => {
    setDraftState(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        ...updates,
      },
    }));
  }, []);

  // Toggle product availability in draft state
  const toggleDraftAvailability = useCallback((productId: string, available: boolean, reason?: string) => {
    updateDraftProduct(productId, {
      available,
      unavailable_reason: available ? null : (reason || 'Vorübergehend nicht verfügbar'),
    });
  }, [updateDraftProduct]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    return originalProducts.some(original => {
      const draft = draftState[original.id];
      if (!draft) return false;
      
      return (
        original.name !== draft.name ||
        original.unit !== draft.unit ||
        original.price !== draft.price ||
        original.min_order !== draft.min_order ||
        original.max_order !== draft.max_order ||
        original.available !== draft.available ||
        original.unavailable_reason !== draft.unavailable_reason ||
        original.description !== draft.description
      );
    });
  }, [originalProducts, draftState]);

  // Save all changes to database
  const saveChanges = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const changedProducts = originalProducts.filter(original => {
        const draft = draftState[original.id];
        if (!draft) return false;
        
        return (
          original.name !== draft.name ||
          original.unit !== draft.unit ||
          original.price !== draft.price ||
          original.min_order !== draft.min_order ||
          original.max_order !== draft.max_order ||
          original.available !== draft.available ||
          original.unavailable_reason !== draft.unavailable_reason ||
          original.description !== draft.description
        );
      });

      // Update each changed product
      for (const original of changedProducts) {
        const draft = draftState[original.id];
        
        await updateKgProduct(original.id, {
          price: draft.price,
          min_order: draft.min_order,
          max_order: draft.max_order,
          available: draft.available,
          unavailable_reason: draft.unavailable_reason,
          description: draft.description,
        });
      }

      // Reload products to get fresh data
      await loadProducts();
      
      setSuccessMessage(`${changedProducts.length} Produkt(e) erfolgreich aktualisiert!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      console.error('Failed to save products:', err);
      setError('Fehler beim Speichern. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSaving(false);
    }
  }, [originalProducts, draftState, loadProducts]);

  // Cancel changes and revert to original state
  const cancelChanges = useCallback(() => {
    const resetDraft: DraftState = {};
    originalProducts.forEach(product => {
      resetDraft[product.id] = { ...product };
    });
    setDraftState(resetDraft);
    setError(null);
    setSuccessMessage(null);
  }, [originalProducts]);

  // Clear messages after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Lade Produkte...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Status Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Products Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Produktverwaltung
            </CardTitle>
            <CardDescription>
              Bearbeiten Sie Preise, Verfügbarkeit und Details Ihrer KG-Produkte
            </CardDescription>
          </div>

          {/* Draft indicator */}
          {hasUnsavedChanges() && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Ungespeicherte Änderungen
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Individual Product Editors */}
          {originalProducts.map(product => (
            <ProductEditor
              key={product.id}
              product={draftState[product.id] || product}
              onUpdate={(updates) => updateDraftProduct(product.id, updates)}
              onToggleAvailability={(available, reason) => 
                toggleDraftAvailability(product.id, available, reason)
              }
            />
          ))}

          {originalProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keine Produkte gefunden.</p>
            </div>
          )}
        </CardContent>

        {/* Action Buttons */}
        {hasUnsavedChanges() && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 justify-end border-t pt-4">
              <Button
                variant="outline"
                onClick={cancelChanges}
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-1" />
                Abbrechen
              </Button>
              <Button
                onClick={saveChanges}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Speichere...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Speichern
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

// =====================================================================================
// EXPORT
// =====================================================================================

export default KgProductsManager;