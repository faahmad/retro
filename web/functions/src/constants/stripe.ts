import { projectIds } from "./project-ids";

const isProd = process.env.GCLOUD_PROJECT === projectIds.prod;

enum DevStripeSubscriptionPlans {
  PRO_MONTHLY = "plan_HFppfQJn3jDBFj",
  PRO_YEARLY = "price_1Iat06KZLl59Zw3Xr6NBJHvQ"
}
enum ProdStripeSubscriptionPlans {
  PRO_MONTHLY = "plan_HGB5FTkzgHuvyk",
  PRO_YEARLY = "price_1Ias3mKZLl59Zw3X4RclJTyN"
}
export const StripeSubscriptionPlans = isProd
  ? ProdStripeSubscriptionPlans
  : DevStripeSubscriptionPlans;
