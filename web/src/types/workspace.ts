import { StripeSubscriptionStatus } from "./stripe-subscription-status";
import { TODO } from "./todo";

export interface Workspace {
  id: string;
  name: string;
  url: string;
  allowedEmailDomains: string[];
  ownerId: string;
  ownerEmail: string;
  createdAt: TODO;
  updatedAt: TODO;
  subscriptionStatus: StripeSubscriptionStatus;
  subscriptionTrialEnd: number;
  retroItemsData: {
    goodCount: number;
    badCount: number;
    actionsCount: number;
    questionsCount: number;
  };
  userCount: number;
  customerId?: string;
  subscriptionId?: string;
  paymentMethodId?: string | null;
}
