import { cn } from "@/lib/utils";
import { HeroContent } from "./hero-content";
import { HeroProps } from "./types";

// Default Cevapcici-focused content
const defaultHeroContent = {
  title: "Authentische Cevapcici & Burger",
  subtitle: "Traditionelle Balkan-Spezialitäten trifft Swiss Quality. Frisch gegrillte Cevapcici, saftige Burger und erstklassige Würste - direkt aus unserem Grill.",
  primaryCTA: {
    text: "KG-Verkauf bestellen",
    href: "#kg-verkauf"
  },
  secondaryCTA: {
    text: "Speisekarte ansehen", 
    href: "#menu"
  }
};

export function HeroSection({ content = defaultHeroContent, className }: HeroProps) {
  return (
    <section className={cn("py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20", className)}>
      <div className="container mx-auto px-4">
        <HeroContent 
          title={content.title}
          subtitle={content.subtitle}
          ctas={{
            primaryCTA: content.primaryCTA,
            secondaryCTA: content.secondaryCTA
          }}
        />
      </div>
    </section>
  );
}