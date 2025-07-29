// KG-Verkauf Types for Meat Sales

export type ProductUnit = 'kg' | 'stk';

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