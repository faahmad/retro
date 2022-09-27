import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { CurrentUserContextValues } from "../contexts/CurrentUserContext";
import { Workspace } from "../types/workspace";
import { increment } from "../utils/firestore-utils";

const db = firebase.firestore();
const workspaceUserCollection = db.collection(FirestoreCollections.WORKSPACE_USER);
const userCollection = db.collection(FirestoreCollections.USER);
const workspaceCollection = db.collection(FirestoreCollections.WORKSPACE);

export interface JoinWorkspaceTransactionParams {
  auth: CurrentUserContextValues["auth"];
  workspaceId: Workspace["id"];
  workspaceName: Workspace["name"];
}

export function anonJoinWorkspaceTransaction(input: any) {
  return db.runTransaction(async (transaction) => {
    // if (!input.auth) {
    //   throw new Error("User auth is undefined.");
    // }

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

    // Increment the workspace's userCount.
    const workspaceRef = workspaceCollection.doc(input.workspaceId);
    transaction.update(workspaceRef, { userCount: increment() });

    return;
  });
}
