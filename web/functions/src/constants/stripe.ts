const isDev = process.env.FUNCTIONS_EMULATOR === "true";

enum DevStripeSubscriptionPlans {
  PRO_MONTHLY = "price_1LmfMDKZLl59Zw3XcQsUWhQU"
}
enum ProdStripeSubscriptionPlans {
  PRO_MONTHLY = "price_1LhucwKZLl59Zw3XntkR7YDJ"
}
export const StripeSubscriptionPlans = isDev
  ? DevStripeSubscriptionPlans
  : ProdStripeSubscriptionPlans;
