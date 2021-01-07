export interface Workspace {
  id: string;
  name: string;
  url: string;
  allowedEmailDomains: string[];
  ownerId: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
  subscriptionStatus: "trialing";
}
