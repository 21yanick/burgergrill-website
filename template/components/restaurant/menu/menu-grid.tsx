import { cn } from "@/lib/utils";
import { MenuCategory } from "./menu-category";
import { MenuCategoryData, MenuItemData } from "./types";

interface MenuGridProps {
  categories: MenuCategoryData[];
  onItemClick?: (item: MenuItemData) => void;
  className?: string;
}

export function MenuGrid({ categories, onItemClick, className }: MenuGridProps) {
  const sortedCategories = categories
    .filter(category => category.items.length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (sortedCategories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Unsere Speisekarte wird gerade aktualisiert.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-16 lg:space-y-20", className)}>
      {sortedCategories.map((category, index) => (
        <div key={category.id}>
          <MenuCategory 
            category={category} 
            onItemClick={onItemClick}
          />
          {/* Separator between categories (except last) */}
          {index < sortedCategories.length - 1 && (
            <div className="mt-16 lg:mt-20">
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent mx-auto" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}