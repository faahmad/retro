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
  returnUrl,
}: CreateBillingPortalSessionParams) {
  const params: Stripe.BillingPortal.SessionCreateParams = {
    customer: customerId,
    return_url: returnUrl,
  };
  return stripe.billingPortal.sessions.create(params);
}
