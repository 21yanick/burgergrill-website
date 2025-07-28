/**
 * Plan Comparison - Server Component
 * Static plan comparison rendered server-side for better performance
 */

import { getAllPlans, getPlanPriceText } from '@/lib/plans';

export function PlanComparison() {
  const plans = getAllPlans();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Plan Comparison</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          // Dynamic styling based on plan
          const cardClasses = plan.popular
            ? "rounded-lg border p-4 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
            : plan.id === 'pro'
            ? "rounded-lg border p-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
            : "rounded-lg border p-4";

          const titleClasses = plan.popular
            ? "font-semibold text-yellow-800 dark:text-yellow-200"
            : plan.id === 'pro'
            ? "font-semibold text-green-800 dark:text-green-200"
            : "font-semibold";

          return (
            <div key={plan.id} className={cardClasses}>
              <div className="space-y-2">
                <h3 className={titleClasses}>
                  {plan.icon} {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <p className="text-lg font-bold">
                  {getPlanPriceText(plan)}
                </p>
                <ul className="text-sm space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}