// Modern Restaurant Hero Section Types 2025

export interface VideoSettings {
  src: string;
  fallbackImage: string;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  controls: boolean;
  preload: 'none' | 'metadata' | 'auto';
  poster?: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  primaryCTA: ({
    text: string;
    href: string;
    icon?: string;
  } | {
    text: string;
    onClick: () => void;
    icon?: string;
  });
  secondaryCTA: {
    text: string;
    href: string;
    icon?: string;
  };
}

export interface ModernHeroProps {
  content?: HeroContent;
  video?: VideoSettings;
  showVideo?: boolean;
  overlayOpacity?: number;
  className?: string;
}

export interface HeroCTAProps {
  primaryCTA: HeroContent['primaryCTA'];
  secondaryCTA: HeroContent['secondaryCTA'];
}

export interface VideoHeroProps {
  videoSrc: string;
  fallbackImage: string;
  children: React.ReactNode;
  overlayOpacity?: number;
  className?: string;
}