import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { CurrentUserContextValues } from "../contexts/CurrentUserContext";
import { Workspace } from "../types/workspace";
import { WorkspaceInvite, WorkspaceInviteStatus } from "../types/workspace-invite";
import { increment } from "../utils/firestore-utils";

const db = firebase.firestore();
const workspaceInviteCollection = db.collection(FirestoreCollections.WORKSPACE_INVITE);
const workspaceUserCollection = db.collection(FirestoreCollections.WORKSPACE_USER);
const userCollection = db.collection(FirestoreCollections.USER);
const workspaceCollection = db.collection(FirestoreCollections.WORKSPACE);

export interface JoinWorkspaceFromInviteTransactionParams {
  auth: CurrentUserContextValues["auth"];
  workspaceInviteId: WorkspaceInvite["id"];
  workspaceId: Workspace["id"];
  workspaceName: Workspace["name"];
}

export function joinWorkspaceFromInviteTransaction(
  input: JoinWorkspaceFromInviteTransactionParams
) {
  return db.runTransaction(async (transaction) => {
    if (!input.auth) {
      throw new Error("User auth is undefined.");
    }

    // Add the workspace to the User doc.
    const userRef = userCollection.doc(input.auth.uid);
    transaction.update(userRef, {
      workspaces: firebase.firestore.FieldValue.arrayUnion({
        id: input.workspaceId,
        name: input.workspaceName
      })
    });

    // Create a composite document for a Workspace User.
    const workspaceUserRef = workspaceUserCollection.doc(
      `${input.workspaceId}_${input.auth.uid}`
    );
    transaction.set(workspaceUserRef, {
      workspaceId: input.workspaceId,
      userId: input.auth.uid,
      userDisplayName: input.auth.displayName,
      userEmail: input.auth.email,
      userPhotoURL: input.auth.photoURL,
      userRole: "member"
    });
    // Update the workspaceInvite doc.
    const workspaceInviteRef = workspaceInviteCollection.doc(input.workspaceInviteId);
    transaction.update(workspaceInviteRef, { status: WorkspaceInviteStatus.ACCEPTED });

    // Increment the workspace's userCount.
    const workspaceRef = workspaceCollection.doc(input.workspaceId);
    transaction.update(workspaceRef, { userCount: increment() });

    return workspaceInviteRef;
  });
}
