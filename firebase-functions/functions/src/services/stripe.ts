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

interface CreateCheckoutSessionParams {
  customerId: Stripe.Customer["id"];
  subscriptionId: Stripe.Subscription["id"];
  successUrl: Stripe.Checkout.Session["success_url"];
  cancelUrl: Stripe.Checkout.Session["cancel_url"];
}
export const createCheckoutSession = ({
  customerId,
  subscriptionId,
  successUrl,
  cancelUrl
}: CreateCheckoutSessionParams) => {
  const params: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ["card"],
    mode: "setup",
    customer: customerId,
    setup_intent_data: {
      metadata: {
        customer_id: customerId,
        subscription_id: subscriptionId
      }
    },
    success_url: successUrl,
    cancel_url: cancelUrl
  };
  return stripe.checkout.sessions.create(params);
};
