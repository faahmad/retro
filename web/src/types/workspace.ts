import { TODO } from "./todo";
import { Retro } from "./retro";

export interface Workspace {
  id: string;
  name: string;
  url: string;
  allowedEmailDomains: string[];
  ownerId: string;
  ownerEmail: string;
  createdAt: TODO;
  updatedAt: TODO;
  subscriptionStatus: string;
  subscriptionTrialEnd: number | null;
  retroItemsData: {
    goodCount: number;
    badCount: number;
    actionsCount: number;
    questionsCount: number;
  };
  customerId?: string;
  subscriptionId?: string;
  recentRetroIds?: string[];
}
