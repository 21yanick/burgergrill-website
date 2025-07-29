import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { HeroCTAProps } from './types';

interface HeroContentProps {
  title: string;
  subtitle: string;
  ctas: HeroCTAProps;
}

export function HeroContent({ title, subtitle, ctas }: HeroContentProps) {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground">
        {title}
      </h1>
      <p className="text-xl text-muted-foreground mb-8 lg:text-2xl leading-relaxed">
        {subtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={ctas.primaryCTA.href}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {ctas.primaryCTA.text}
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href={ctas.secondaryCTA.href}>
            {ctas.secondaryCTA.text}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}