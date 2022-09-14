const isDev = process.env.FUNCTIONS_EMULATOR === "true";

enum DevStripeSubscriptionPlans {
  PRO_MONTHLY = "plan_HFppfQJn3jDBFj",
  PRO_YEARLY = "price_1Iat06KZLl59Zw3Xr6NBJHvQ"
}
enum ProdStripeSubscriptionPlans {
  PRO_MONTHLY = "price_1LhucwKZLl59Zw3XntkR7YDJ",
  PRO_YEARLY = "price_1LhudiKZLl59Zw3XvltpqHMF"
}
export const StripeSubscriptionPlans = isDev
  ? DevStripeSubscriptionPlans
  : ProdStripeSubscriptionPlans;
