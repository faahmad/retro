import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Workspace } from "../types/workspace";
import { WorkspaceUrl } from "../types/workspace-url";

const db = firebase.firestore();
const workspaceCollection = db.collection(FirestoreCollections.WORKSPACE);
const workspaceUrlCollection = db.collection(FirestoreCollections.WORKSPACE_URL);
const workspaceUserCollection = db.collection(FirestoreCollections.WORKSPACE_USER);
const userCollection = db.collection(FirestoreCollections.USER);
export interface CreateWorkspaceTransactionInput {
  name: string;
  url: string;
  allowedEmailDomain: string;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  userPhotoURL: string;
}

export function createWorkspaceTransaction(input: CreateWorkspaceTransactionInput) {
  return db.runTransaction(async (transaction) => {
    // Make sure the workspaceUrl isn't already taken.
    const workspaceUrlRef = workspaceUrlCollection.doc(input.url);
    const workspaceUrlDoc = await transaction.get(workspaceUrlRef);
    if (workspaceUrlDoc.exists) {
      throw "Workspace URL is already taken.";
    }
    // Create the workspace.
    const newWorkspaceRef = workspaceCollection.doc();
    transaction.set(newWorkspaceRef, {
      name: input.name,
      url: input.url,
      allowedEmailDomains: [input.allowedEmailDomain],
      ownerId: input.userId,
      ownerEmail: input.userEmail,
      retroItemsData: {
        goodCount: 0,
        badCount: 0,
        actionsCount: 0,
        questionsCount: 0
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      subscriptionStatus: "trialing",
      subscriptionTrialEnd: null
    });
    // Create the workspaceUrl.
    transaction.set(workspaceUrlRef, { url: input.url, workspaceId: newWorkspaceRef.id });
    // Add the workspace to the user's document.
    const userRef = userCollection.doc(input.userId);
    transaction.update(userRef, {
      workspaces: firebase.firestore.FieldValue.arrayUnion({
        id: newWorkspaceRef.id,
        name: input.name
      })
    });
    // Add the user to the workspace_user collection.
    const workspaceUserRef = workspaceUserCollection.doc(newWorkspaceRef.id);
    transaction.set(
      workspaceUserRef,
      {
        users: {
          [input.userId]: {
            displayName: input.userDisplayName,
            email: input.userEmail,
            photoURL: input.userPhotoURL
          }
        }
      },
      { merge: true }
    );
    // Return the newWorkspaceRef.
    return newWorkspaceRef;
  });
}

export async function getWorkspaceById(id: string) {
  const workspaceSnapshot = await workspaceCollection.doc(id).get();
  return workspaceSnapshot.data() as Workspace | undefined;
}
