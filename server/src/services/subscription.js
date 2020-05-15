import { getWorkspaceFromFirestore } from "./firestore";
import { getStripeSubscription } from "./stripe";

export async function getWorkspaceSubscription(workspaceId) {
  const workspace = await getWorkspaceFromFirestore(workspaceId);
  if (!workspace.subscriptionId) {
    return null;
  }
  return getStripeSubscription(workspace.subscriptionId);
}
