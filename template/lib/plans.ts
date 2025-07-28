/**
 * Swiss SaaS Template - Plan Configuration
 * Centralized plan definitions using site config
 */

import { siteConfig } from './config';

export type PlanType = 'free' | 'starter' | 'pro';

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  price: number; // in configured currency
  currency: typeof siteConfig.currency;
  interval: 'month';
  icon: string;
  features: string[];
  badgeVariant: 'secondary' | 'outline' | 'default';
  popular?: boolean;
  priceId: string | null; // Stripe price ID for paid plans
}

/**
 * Swiss-optimized plan definitions
 * Prices in Swiss Francs (CHF)
 */
export const PLANS: Record<PlanType, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Für erste Schritte und Testen',
    price: 0,
    currency: siteConfig.currency,
    interval: 'month',
    icon: '🆓',
    badgeVariant: 'secondary',
    popular: false,
    priceId: null,
    features: [
      'Bis zu 1 Benutzer',
      'Basis Features',
      'Community Support',
      'Bis zu 100 Einträge',
      'Basic Dashboard'
    ]
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Perfekt für kleine Teams und Startups',
    price: siteConfig.pricing.starter,
    currency: siteConfig.currency,
    interval: 'month',
    icon: '🟡',
    badgeVariant: 'outline',
    popular: true,
    priceId: null, // Will be set from env.STRIPE_STARTER_PRICE_ID
    features: [
      'Bis zu 5 Benutzer',
      'Alle Basis Features',
      'E-Mail Support',
      'Bis zu 1000 Einträge',
      'Erweiterte Analytics',
      'Mobile App Zugang'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'Für wachsende Unternehmen',
    price: siteConfig.pricing.pro,
    currency: siteConfig.currency,
    interval: 'month',
    icon: '🟢',
    badgeVariant: 'default',
    popular: false,
    priceId: null, // Will be set from env.STRIPE_PRO_PRICE_ID
    features: [
      'Bis zu 25 Benutzer',
      'Alle Starter Features',
      'Priority Support',
      'Unbegrenzte Einträge',
      'Erweiterte Integrationen',
      'API Zugang',
      'Custom Branding'
    ]
  }
} as const;

/**
 * Get plan information by plan type
 */
export function getPlan(planType: PlanType): Plan {
  return PLANS[planType] || PLANS.free;
}

/**
 * Format currency using site configuration
 */
export function formatSwissPrice(price: number): string {
  if (price === 0) return 'Free forever';
  
  return new Intl.NumberFormat(siteConfig.locale, {
    style: 'currency',
    currency: siteConfig.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Get plan price display text
 */
export function getPlanPriceText(plan: Plan): string {
  if (plan.price === 0) return 'Free forever';
  return `${plan.currency} ${plan.price.toFixed(2)}/${plan.interval}`;
}

/**
 * Get plans with environment-specific price IDs
 */
export function getPlansWithPriceIds(): Plan[] {
  const plans = [PLANS.free, PLANS.starter, PLANS.pro];
  
  // Set price IDs from environment variables with proper null handling
  return plans.map(plan => {
    if (plan.id === 'starter') {
      return { ...plan, priceId: process.env.STRIPE_STARTER_PRICE_ID || null };
    }
    if (plan.id === 'pro') {
      return { ...plan, priceId: process.env.STRIPE_PRO_PRICE_ID || null };
    }
    return plan;
  });
}

/**
 * Get all plans as array for comparison display
 */
export function getAllPlans(): Plan[] {
  return [PLANS.free, PLANS.starter, PLANS.pro];
}