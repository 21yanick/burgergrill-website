import { cn } from "@/lib/utils";
import { MenuItem } from "./menu-item";
import { MenuCategoryProps } from "./types";

export function MenuCategory({ category, onItemClick }: MenuCategoryProps) {
  if (category.items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
          {category.name}
        </h2>
        {category.description && (
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
      </div>

      {/* Menu Items Grid */}
      <div className="grid gap-4 md:gap-6">
        {category.items
          .sort((a, b) => {
            // Signature items first, then alphabetical
            if (a.isSignature && !b.isSignature) return -1;
            if (!a.isSignature && b.isSignature) return 1;
            return a.name.localeCompare(b.name, 'de-CH');
          })
          .map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              onItemClick={onItemClick}
              showImage={true}
            />
          ))}
      </div>
    </div>
  );
}