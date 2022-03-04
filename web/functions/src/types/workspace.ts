export interface Workspace {
  id: string;
  name: string;
  url: string;
  allowedEmailDomains: string[];
  ownerId: string;
  ownerEmail: string;
  createdAt: any;
  updatedAt: any;
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
  userCount: number;
}
