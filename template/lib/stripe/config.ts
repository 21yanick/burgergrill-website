import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
});

// SaaS-only Payment Types  
export type PaymentMode = 'subscription' | 'payment' | 'setup';

// Swiss-only Payment Methods Configuration
export const PAYMENT_METHODS = {
  swiss: ['card', 'twint'],
} as const;

// SaaS Subscription Configuration
export const SUBSCRIPTION_PRICES = {
  starter: process.env.STRIPE_STARTER_PRICE_ID!,
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
} as const;

// Swiss SaaS Configuration (no conditionals needed)
export const SWISS_SAAS_CONFIG = {
  region: 'swiss',
  paymentMethods: PAYMENT_METHODS.swiss,
  currency: 'CHF',
  subscriptions: true, // Always enabled for SaaS
} as const;

// Get Swiss payment methods for SaaS checkout
export function getSwissPaymentMethods() {
  return SWISS_SAAS_CONFIG.paymentMethods;
}