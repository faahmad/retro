import { getWorkspaceFromFirestore } from "./firestore";
import { getStripeSubscription } from "./stripe";

export async function getWorkspaceSubscription(workspaceId) {
  const workspace = await getWorkspaceFromFirestore(workspaceId);
  return getStripeSubscription(workspace.subscriptionId);
}
