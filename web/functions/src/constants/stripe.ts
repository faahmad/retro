import { projectIds } from "./project-ids";

const isProd = process.env.GCLOUD_PROJECT === projectIds.prod;

enum DevStripeSubscriptionPlans {
  PRO = "plan_HFppfQJn3jDBFj"
}
enum ProdStripeSubscriptionPlans {
  PRO = "plan_HGB5FTkzgHuvyk"
}
export const StripeSubscriptionPlans = isProd
  ? ProdStripeSubscriptionPlans
  : DevStripeSubscriptionPlans;
