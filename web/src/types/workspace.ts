export interface Workspace {
  id: string;
  name: string;
  url: string;
  allowedEmailDomain: string;
  createdAt: string;
  updatedAt: string;
  customerId?: string;
  subscriptionId?: string;
}
