// Menu Types for Restaurant

export interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number; // in CHF
  image?: string;
  allergens?: string[];
  available: boolean;
  isSignature?: boolean; // Cevapcici signature dishes
}

export interface MenuCategoryData {
  id: string;
  name: string;
  description?: string;
  items: MenuItemData[];
  sortOrder: number;
  icon?: string;
}

export interface MenuProps {
  categories: MenuCategoryData[];
  className?: string;
}

export interface MenuItemProps {
  item: MenuItemData;
  onItemClick?: (item: MenuItemData) => void;
  showImage?: boolean;
}

export interface MenuCategoryProps {
  category: MenuCategoryData;
  onItemClick?: (item: MenuItemData) => void;
}