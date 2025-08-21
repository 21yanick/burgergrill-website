// Menu Types for Authentic Burgergrill Restaurant 2025

// Main dish with price and special flags
export interface MainDish {
  id: string;
  name: string;
  price: number; // in CHF
  isSignature?: boolean; // Cevapcici specialties  
  isProfitable?: boolean; // Mix dishes with higher margins
  available?: boolean;
  // 🆕 IMAGE INTEGRATION
  image?: string;           // "/images/menu/hauptgerichte/cevapcici-7stk.jpg"
  imageAlt?: string;        // "Cevapcici im Fladenbrot mit Ajvar und Zwiebeln"
}

// Simple accompaniment without price
export interface Accompaniment {
  id: string;
  name: string;
}

// Simple sauce without price  
export interface Sauce {
  id: string;
  name: string;
}

// Flat-price drinks
export interface DrinkData {
  title: string;
  description: string;
  price: number; // All drinks same price
}

// Complete menu structure matching real menu card
export interface BurgergrillMenu {
  hauptgerichte: MainDish[];
  beilagen: Accompaniment[];
  saucen: Sauce[];
  getränke: DrinkData;
  kontakt: {
    telefon: string;
    vorbestellungText: string;
  };
}

// 🆕 IMAGE SYSTEM TYPES

// Image loading states for error handling
export type ImageLoadState = 'loading' | 'loaded' | 'error';

// Image configuration for menu photos
export interface MenuImageConfig {
  basePath: string;         // "/images/menu/hauptgerichte"
  fallbackImage: string;    // "/images/menu/fallback/dish-placeholder.jpg"
  aspectRatio: number;      // 4/3 for food photos
}

// Component Props
export interface MenuSectionProps {
  menu?: BurgergrillMenu;
  className?: string;
}

export interface MainDishCardProps {
  dish: MainDish;
  onDishClick?: (dish: MainDish) => void;
  priority?: boolean;       // 🆕 Priority loading for above-the-fold images
}

export interface SimpleListProps {
  items: Accompaniment[] | Sauce[];
  title?: string; 
  icon?: string;
}

export interface DrinkCardProps {
  drinks: DrinkData;
}

export interface ContactCTAProps {
  kontakt: BurgergrillMenu['kontakt'];
}

// Navigation
export type MenuCategory = 'hauptgerichte' | 'beilagen' | 'saucen' | 'getränke';

export interface CategoryTabProps {
  categories: MenuCategory[];
  activeCategory: MenuCategory;
  onCategoryChange: (category: MenuCategory) => void;
}