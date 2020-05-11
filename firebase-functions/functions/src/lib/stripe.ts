import * as functions from "firebase-functions";
import Stripe from "stripe";
import { StripeSubscriptionPlans } from "../constants/stripe";

const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: "2020-03-02",
});

export const createCustomer = (name: string, email: string) => {
  const params: Stripe.CustomerCreateParams = {
    name,
    email,
  };
  return stripe.customers.create(params);
};

export const subscribeCustomerToProPlan = (customerId: string) => {
  const params: Stripe.SubscriptionCreateParams = {
    customer: customerId,
    items: [{ plan: StripeSubscriptionPlans.PRO }],
    trial_from_plan: true,
  };
  return stripe.subscriptions.create(params);
};
