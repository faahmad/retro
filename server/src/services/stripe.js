import { stripe } from "../lib/stripe";
import { get } from "lodash";

export async function getStripeCustomer(customerId) {
  const customer = await stripe.customers.retrieve(customerId);
  console.log(JSON.stringify(customer, null, 2));
  return {
    id: customer.id,
    defaultPaymentMethod: get(customer, "invoice_settings.default_payment_method", null)
  };
}

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
