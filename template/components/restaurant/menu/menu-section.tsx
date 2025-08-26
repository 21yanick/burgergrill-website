"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { MenuSectionProps, MenuCategory, MainDish } from "./types";
import { authenticBurgergrillMenu, menuHeader } from "./menu-data";
import { CategoryTabs, useActiveCategory } from "./category-tabs";
import { MainDishGrid } from "./main-dish-card";
import { SimpleList } from "./simple-list";
import { DrinkSection } from "./drink-card";
import { ContactCTA } from "./contact-cta";

export function MenuSection({ 
  menu = authenticBurgergrillMenu, 
  className 
}: MenuSectionProps) {
  
  // Category navigation state
  const categories: MenuCategory[] = ['hauptgerichte', 'beilagen', 'saucen', 'getränke'];
  const [activeCategory, setActiveCategory] = useActiveCategory(categories);
  
  // Dish interaction handler
  const handleDishClick = (dish: MainDish) => {
    // Future: Open dish detail modal or add to cart
    console.log('Dish clicked:', dish);
  };

  return (
    <section id="menu" className={cn("relative", className)}>
      {/* Header Section */}
      <div className="py-16 lg:py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              {menuHeader.title}
            </h2>
            <p className="text-xl lg:text-2xl text-accent font-semibold mb-3">
              {menuHeader.subtitle}
            </p>
            <p className="text-lg text-primary font-medium mb-2">
              {menuHeader.description}
            </p>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Menu Content */}
      <div className="py-12 lg:py-16">
        <div className="container mx-auto px-4 space-y-20">
          
          {/* Hauptgerichte Section */}
          <section id="category-hauptgerichte" className="scroll-mt-32">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <span className="text-4xl">🍔</span>
                <span>Hauptgerichte</span>
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Unsere authentischen Spezialitäten, frisch vom Grill
              </p>
            </div>
            
            <MainDishGrid 
              dishes={menu.hauptgerichte}
              onDishClick={handleDishClick}
            />
          </section>

          {/* Beilagen Section */}
          <section id="category-beilagen" className="scroll-mt-32">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <span className="text-4xl">🥗</span>
                <span>Beilagen</span>
              </h3>
            </div>
            
            <div className="max-w-lg mx-auto">
              <SimpleList 
                items={menu.beilagen} 
              />
            </div>
          </section>

          {/* Saucen Section - Separate for better navigation */}
          <section id="category-saucen" className="scroll-mt-32">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <span className="text-4xl">🌶️</span>
                <span>Saucen</span>
              </h3>
            </div>
            
            <div className="max-w-lg mx-auto">
              <SimpleList 
                items={menu.saucen} 
              />
            </div>
          </section>

          {/* Getränke Section */}
          <section id="category-getränke" className="scroll-mt-32">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <span className="text-4xl">🥤</span>
                <span>Getränke</span>
              </h3>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <DrinkSection drinks={menu.getränke} />
            </div>
          </section>

          {/* Contact CTA Section */}
          <section className="pt-8">
            <div className="max-w-3xl mx-auto">
              <ContactCTA kontakt={menu.kontakt} />
            </div>
          </section>
        </div>
      </div>

    </section>
  );
}