export interface Workspace {
  id: string;
  name: string;
  owner: {
    id: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  url?: string;
  customerId?: string;
  subscriptionId?: string;
  allowedEmailDomain?: string;
}
