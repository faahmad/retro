import Stripe from "stripe";
import { stripe } from "../lib/stripe";
import { StripeSubscriptionPlans } from "../constants/stripe";

export const createCustomer = (name: string, email: string) => {
  const params: Stripe.CustomerCreateParams = {
    name,
    email
  };
  return stripe.customers.create(params);
};

export const subscribeCustomerToProPlan = (customerId: string) => {
  const params: Stripe.SubscriptionCreateParams = {
    customer: customerId,
    items: [{ plan: StripeSubscriptionPlans.PRO }],
    trial_from_plan: true
  };
  return stripe.subscriptions.create(params);
};

interface CreateBillingPortalSessionParams {
  customerId: Stripe.Customer["id"];
  returnUrl: Stripe.BillingPortal.Session["return_url"];
}
export function createBillingPortalSession({
  customerId,
  returnUrl
}: CreateBillingPortalSessionParams) {
  const params: Stripe.BillingPortal.SessionCreateParams = {
    customer: customerId,
    return_url: returnUrl
  };
  return stripe.billingPortal.sessions.create(params);
}

// export async function getStripeSubscription(subscriptionId: Stripe.Subscription["id"]) {
//   const subscription = await stripe.subscriptions.retrieve(subscriptionId);

//   return {
//     id: subscription.id,
//     customerId: subscription.customer,
//     status: subscription.status,
//     plan: {
//       id: subscription?.plan?.id,
//       active: subscription?.plan?.active,
//       amount: subscription?.plan?.amount,
//       currency: subscription?.plan?.currency,
//       interval: subscription?.plan?.interval,
//       productId: subscription?.plan?.product
//     },
//     trialStart: subscription.trial_start,
//     trialEnd: subscription.trial_end,
//     startDate: subscription.start_date,
//     currentPeriodStart: subscription.current_period_start,
//     currentPeriodEnd: subscription.current_period_end
//   };
// }
