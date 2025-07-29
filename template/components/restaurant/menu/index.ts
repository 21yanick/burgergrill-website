// Modern Restaurant Menu Components 2025
export { MenuSection } from './menu-section';

// Component Exports
export { CategoryTabs, useActiveCategory } from './category-tabs';
export { MainDishCard, MainDishGrid } from './main-dish-card';
export { SimpleList, AccompanimentsSection } from './simple-list';
export { DrinkCard, DrinkSection } from './drink-card';
export { ContactCTA, CompactContactCTA } from './contact-cta';

// Data Exports
export { authenticBurgergrillMenu, categoryLabels, categoryIcons, menuHeader } from './menu-data';

// Type Exports
export type { 
  MainDish, 
  Accompaniment, 
  Sauce, 
  DrinkData, 
  BurgergrillMenu,
  MenuSectionProps,
  MainDishCardProps,
  SimpleListProps,
  DrinkCardProps,
  ContactCTAProps,
  MenuCategory,
  CategoryTabProps
} from './types';