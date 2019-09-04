import * as Stripe from "stripe";
import { config } from "../config";

const stripe = new Stripe(config.stripe.testSecretKey);

// Testing purposes only.
export const RETRO_STRIPE = {
  TEST_PRODUCT_ID: "prod_FkUKgKmZt4U2w1",
  TEST_PLAN_STANDARD_ID: "plan_FkVLJWl8oqOeOi"
};

export const stripeService = {
  createCustomer: async (email: string) => {
    return stripe.customers.create({ email });
  },
  createProduct: async (name: string, type: Stripe.products.ProductType) => {
    return stripe.products.create({
      name,
      type
    });
  },
  createPlan: async (name: string, amount: number) => {
    return stripe.plans.create({
      amount,
      nickname: name,
      trial_period_days: 30,
      product: RETRO_STRIPE.TEST_PRODUCT_ID,
      currency: "usd",
      interval: "month"
    });
  },
  subscribeCustomerToStandardPlan: async (stripeCustomerId: string) => {
    return stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ plan: RETRO_STRIPE.TEST_PLAN_STANDARD_ID }],
      trial_from_plan: true
    });
  }
};
