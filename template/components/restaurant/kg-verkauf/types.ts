// KG-Verkauf Types for Meat Sales

import type { KgProduct, CreateKgProductData } from '@/lib/restaurant/actions/kg-products';

export type ProductUnit = 'kg' | 'stk' | 'pack';

export interface KgVerkaufProduct {
  id: string;
  name: string;
  description: string;
  price: number; // CHF per unit
  unit: ProductUnit; // 'kg' or 'stk'
  minOrder: number; // minimum quantity
  maxOrder: number; // maximum quantity
  available: boolean;
  preparationTime: string; // e.g. "24h", "2 Tage"
}

export interface SelectedProduct {
  product: KgVerkaufProduct;
  quantity: number; // in kg or stk
}

export interface KgOrderData {
  products: SelectedProduct[]; // Multiple products in one order
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string; // ISO date string
  specialRequests?: string;
  totalPrice: number; // calculated total for all products
}

export interface KgOrderFormData {
  productId: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
  specialRequests?: string;
}

export interface KgVerkaufDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: KgOrderData) => void;
  selectedProduct?: KgVerkaufProduct;
}

// =====================================================================================
// TYPE MAPPING LAYER - DATABASE ↔ FRONTEND CONVERSION
// =====================================================================================

/**
 * Convert database KgProduct to frontend KgVerkaufProduct
 * Handles field name conversion (snake_case → camelCase) and ignores DB-only fields
 */
export function dbToFrontend(dbProduct: KgProduct): KgVerkaufProduct {
  return {
    id: dbProduct.product_id,           // Use product_id as frontend id
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    unit: dbProduct.unit as ProductUnit,
    minOrder: dbProduct.min_order,      // snake_case → camelCase
    maxOrder: dbProduct.max_order,      // snake_case → camelCase
    available: dbProduct.available,
    preparationTime: dbProduct.preparation_time, // snake_case → camelCase
  };
}

/**
 * Convert frontend KgVerkaufProduct to database CreateKgProductData
 * Handles field name conversion (camelCase → snake_case) and sets defaults
 */
export function frontendToDb(frontendProduct: KgVerkaufProduct): CreateKgProductData {
  return {
    product_id: frontendProduct.id,       // Frontend id becomes product_id
    name: frontendProduct.name,
    description: frontendProduct.description,
    price: frontendProduct.price,
    unit: frontendProduct.unit,
    min_order: frontendProduct.minOrder,   // camelCase → snake_case
    max_order: frontendProduct.maxOrder,   // camelCase → snake_case
    available: frontendProduct.available,
    preparation_time: frontendProduct.preparationTime, // camelCase → snake_case
  };
}

/**
 * Convert array of database products to frontend products
 * Utility function for bulk conversion
 */
export function dbArrayToFrontend(dbProducts: KgProduct[]): KgVerkaufProduct[] {
  return dbProducts.map(dbToFrontend);
}

/**
 * Type guard to check if a product is available
 * Used for filtering and validation
 */
export function isProductAvailable(product: KgVerkaufProduct): boolean {
  return product.available === true;
}