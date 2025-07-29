"use client";

import { cn } from "@/lib/utils";
import { MenuGrid } from "./menu-grid";
import { MenuCategoryData, MenuItemData } from "./types";

interface MenuSectionProps {
  categories?: MenuCategoryData[];
  onItemClick?: (item: MenuItemData) => void;
  className?: string;
}

// Sample Cevapcici-Grill Menu Data
const defaultMenuData: MenuCategoryData[] = [
  {
    id: "cevapcici-burger",
    name: "Cevapcici-Burger",
    description: "Unsere Signature-Kreationen mit authentischen Cevapcici aus traditioneller Herstellung",
    sortOrder: 1,
    items: [
      {
        id: "classic-cevapcici",
        name: "Classic Cevapcici-Burger",
        description: "6 handgemachte Cevapcici, Zwiebeln, Kajmak, Ajvar, frisches Fladenbrot",
        price: 16.50,
        available: true,
        isSignature: true,
        allergens: ["Gluten", "Milch"]
      },
      {
        id: "xl-cevapcici",
        name: "XL Cevapcici-Burger",
        description: "10 Cevapcici, doppelt Kajmak, scharfer Ajvar, geröstete Zwiebeln, Pommes",
        price: 22.00,
        available: true,
        isSignature: true,
        allergens: ["Gluten", "Milch"]
      },
      {
        id: "cevapcici-deluxe",
        name: "Cevapcici Deluxe",
        description: "8 Cevapcici, Pljeskavica, Kajmak, Ajvar, Gurken, Tomaten, hausgemachtes Brot",
        price: 19.50,
        available: true,
        isSignature: true,
        allergens: ["Gluten", "Milch", "Ei"]
      }
    ]
  },
  {
    id: "klassische-burger",
    name: "Klassische Burger",
    description: "Saftige Beef-Burger mit schweizer Premium-Rindfleisch",
    sortOrder: 2,
    items: [
      {
        id: "swiss-classic",
        name: "Swiss Classic Burger",
        description: "180g Beef Patty, Schweizer Käse, Salat, Tomaten, Zwiebeln, Burger-Sauce",
        price: 14.50,
        available: true,
        allergens: ["Gluten", "Milch", "Ei"]
      },
      {
        id: "bacon-cheese",
        name: "Bacon & Cheese Burger",
        description: "180g Beef Patty, Bacon, Cheddar, Salat, Tomaten, BBQ-Sauce",
        price: 16.00,
        available: true,
        allergens: ["Gluten", "Milch", "Ei"]
      },
      {
        id: "mushroom-swiss",
        name: "Mushroom Swiss Burger",
        description: "200g Beef Patty, sautierte Champignons, Schweizer Käse, Rucola",
        price: 17.50,
        available: true,
        allergens: ["Gluten", "Milch"]
      }
    ]
  },
  {
    id: "wuerste-grill",
    name: "Würste & Grill-Spezialitäten",
    description: "Traditionelle Grillwürste und Balkan-Spezialitäten",
    sortOrder: 3,
    items: [
      {
        id: "bratwurst",
        name: "Schweizer Bratwurst",
        description: "2 traditionelle Bratwürste, Senf, Zwiebeln, Brot",
        price: 12.50,
        available: true,
        allergens: ["Gluten", "Senf"]
      },
      {
        id: "pljeskavica",
        name: "Pljeskavica",
        description: "Grosse balkanische Frikadelle, Kajmak, Ajvar, Zwiebeln, Fladenbrot",
        price: 15.00,
        available: true,
        isSignature: true,
        allergens: ["Gluten", "Milch"]
      },
      {
        id: "mixed-grill",
        name: "Mixed Grill Teller",
        description: "Cevapcici, Pljeskavica, Bratwurst, Kajmak, Ajvar, Pommes",
        price: 24.50,
        available: true,
        isSignature: true,
        allergens: ["Gluten", "Milch", "Senf"]
      }
    ]
  }
];

export function MenuSection({ 
  categories = defaultMenuData, 
  onItemClick, 
  className 
}: MenuSectionProps) {
  return (
    <section id="menu" className={cn("py-20 lg:py-32", className)}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Unsere Speisekarte
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Authentische Cevapcici nach traditionellem Rezept, saftige Burger mit schweizer Rindfleisch 
            und erstklassige Grillspezialitäten - alles frisch zubereitet auf unserem Holzkohlegrill.
          </p>
        </div>

        {/* Menu Grid */}
        <MenuGrid 
          categories={categories} 
          onItemClick={onItemClick}
        />

      </div>
    </section>
  );
}