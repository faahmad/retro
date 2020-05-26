import { getWorkspaceFromFirestore } from "./firestore";
import { getStripeCustomer } from "./stripe";

export async function getWorkspaceCustomer(workspaceId) {
  const workspace = await getWorkspaceFromFirestore(workspaceId);
  if (!workspace.customerId) {
    return null;
  }
  return getStripeCustomer(workspace.customerId);
}
