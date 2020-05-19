import { stripe } from "../lib/stripe";

export async function getStripeSubscription(subscriptionId) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return {
    id: subscription.id,
    customerId: subscription.customer,
    status: subscription.status,
    plan: {
      id: subscription.plan.id,
      active: subscription.plan.active,
      amount: subscription.plan.amount,
      currency: subscription.plan.currency,
      interval: subscription.plan.interval,
      productId: subscription.plan.product
    },
    trialStart: subscription.trial_start,
    trialEnd: subscription.trial_end,
    startDate: subscription.start_date,
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end
  };
}
