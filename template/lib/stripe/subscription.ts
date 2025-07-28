import { stripe, SUBSCRIPTION_PRICES, SWISS_SAAS_CONFIG, getSwissPaymentMethods } from './config';
import { getUser } from '@/lib/supabase/server';
import Stripe from 'stripe';

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PRICES;

export interface CreateSubscriptionCheckoutOptions {
  priceId: SubscriptionPlan;
  trialDays?: number;
  promoCode?: string;
  metadata?: Record<string, string>;
}

export async function createSubscriptionCheckout({
  priceId,
  trialDays,
  promoCode,
  metadata = {},
}: CreateSubscriptionCheckoutOptions) {
  const user = await getUser();
  if (!user?.email) throw new Error('User not authenticated');

  const config = SWISS_SAAS_CONFIG;
  const paymentMethods = getSwissPaymentMethods();

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer_email: user.email,
    mode: 'subscription',
    payment_method_types: [...paymentMethods] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
    line_items: [
      {
        price: SUBSCRIPTION_PRICES[priceId],
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      userId: user.id,
      businessModel: 'saas',
      plan: priceId,
      ...metadata,
    },
    subscription_data: {
      metadata: {
        userId: user.id,
        plan: priceId,
      },
    },
  };

  // Add trial period if specified
  if (trialDays && trialDays > 0) {
    sessionParams.subscription_data = {
      ...sessionParams.subscription_data,
      trial_period_days: trialDays,
    };
  }

  // Add promotional code if specified
  if (promoCode) {
    sessionParams.discounts = [{ promotion_code: promoCode }];
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  return session;
}

export async function cancelSubscription(subscriptionId: string, atPeriodEnd = true) {
  const user = await getUser();
  if (!user) throw new Error('User not authenticated');

  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: atPeriodEnd,
    metadata: {
      cancelledBy: user.id,
      cancelledAt: new Date().toISOString(),
    },
  });
}

export async function resumeSubscription(subscriptionId: string) {
  const user = await getUser();
  if (!user) throw new Error('User not authenticated');

  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
    metadata: {
      resumedBy: user.id,
      resumedAt: new Date().toISOString(),
    },
  });
}

export async function updateSubscription(subscriptionId: string, newPriceId: SubscriptionPlan) {
  const user = await getUser();
  if (!user) throw new Error('User not authenticated');

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: SUBSCRIPTION_PRICES[newPriceId],
      },
    ],
    metadata: {
      updatedBy: user.id,
      updatedAt: new Date().toISOString(),
      previousPlan: subscription.items.data[0].price.id || '',
      newPlan: SUBSCRIPTION_PRICES[newPriceId] || '',
    },
  });
}