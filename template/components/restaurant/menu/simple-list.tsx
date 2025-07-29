"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SimpleListProps } from "./types";

export function SimpleList({ items, title, icon }: SimpleListProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          {icon && <span className="text-2xl">{icon}</span>}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "group p-3 rounded-lg transition-all duration-200",
                "bg-muted/30 hover:bg-muted/50",
                "border border-transparent hover:border-primary/20",
                "hover:shadow-sm"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm group-hover:text-primary transition-colors">
                  {item.name}
                </span>
                
                {/* Small decorative element */}
                <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary/40 transition-colors" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Special note for Saucen */}
        {title === 'Saucen' && (
          <div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/20">
            <p className="text-xs text-muted-foreground text-center">
              💡 <strong>Hinweis:</strong> Käse = Cheddar Sauce
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Responsive layout for both Beilagen and Saucen
export function AccompanimentsSection({ 
  beilagen, 
  saucen 
}: { 
  beilagen: SimpleListProps['items'], 
  saucen: SimpleListProps['items'] 
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <SimpleList 
        items={beilagen} 
        title="Beilagen" 
        icon="🥗"
      />
      <SimpleList 
        items={saucen} 
        title="Saucen" 
        icon="🌶️"
      />
    </div>
  );
}