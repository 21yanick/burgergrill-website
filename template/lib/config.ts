/**
 * Site Configuration - Single Source of Truth
 * ✅ SHARED: Core config used by all business models
 * Restaurant configuration - Swiss locale and CHF currency
 */

export const siteConfig = {
  // Restaurant Brand Identity
  name: "Burgergrill",
  description: "Das beste Burgergrill in der Schweiz. Frische Zutaten, perfekt gegrillte Burger und authentische Schweizer Qualität.",
  
  // Regional Settings for Switzerland
  currency: "CHF" as const,
  region: "swiss" as const,
  locale: "de-CH" as const,
  
  // Restaurant Contact Information
  contact: {
    email: "info@burgergrill.ch",
    company: "Burgergrill AG"
  }
} as const;

// Type exports for TypeScript safety
export type SiteConfig = typeof siteConfig;
export type Currency = typeof siteConfig.currency;
export type Region = typeof siteConfig.region;
export type Locale = typeof siteConfig.locale;

/**
 * Helper function to get formatted currency display
 */
export function formatPrice(amount: number): string {
  if (amount === 0) return 'Free forever';
  
  return new Intl.NumberFormat(siteConfig.locale, {
    style: 'currency',
    currency: siteConfig.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Helper function to get site metadata
 */
export function getSiteMetadata() {
  return {
    title: `${siteConfig.name} - Das beste Burgergrill der Schweiz`,
    description: siteConfig.description,
    author: siteConfig.contact.company,
    keywords: ['burger', 'grill', 'restaurant', 'schweiz', 'chf', siteConfig.region]
  };
}