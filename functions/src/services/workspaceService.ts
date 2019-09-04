import * as firebaseAdmin from "firebase-admin";

const workspaceSubscriptionsCollection = firebaseAdmin
  .firestore()
  .collection("workspaceSubscriptions");
const workspacesCollection = firebaseAdmin.firestore().collection("workspaces");

type UID = firebaseAdmin.firestore.DocumentReference["id"];

export const workspaceService = {
  findWorkspaceById: async (workspaceId: UID) => {
    const workspaceRef = await workspacesCollection.doc(workspaceId).get();
    return workspaceRef.data() as RetroWorkspace | undefined;
  },
  updateWorkspacePlan: async (
    workspaceId: UID,
    newWorkspaceSubscription: RetroWorkspaceSubscription
  ) => {
    return workspaceSubscriptionsCollection
      .doc(workspaceId)
      .set(newWorkspaceSubscription);
  }
};
