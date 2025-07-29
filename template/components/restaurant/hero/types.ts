// Hero Section Types for Restaurant

export interface HeroContent {
  title: string;
  subtitle: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA: {
    text: string;
    href: string;
  };
}

export interface HeroProps {
  content?: HeroContent;
  className?: string;
}

export interface HeroCTAProps {
  primaryCTA: HeroContent['primaryCTA'];
  secondaryCTA: HeroContent['secondaryCTA'];
}