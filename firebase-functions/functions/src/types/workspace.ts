export interface Workspace {
  name: string;
  url: string;
  allowedEmailDomains: string[];
  ownerId: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
  subscriptionStatus: "trialing";
}
