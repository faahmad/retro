import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Workspace } from "../types/workspace";
import { WorkspaceInvite, WorkspaceInviteStatus } from "../types/workspace-invite";
import { WorkspaceUser } from "../types/workspace-user";

const db = firebase.firestore();
const workspaceCollection = db.collection(FirestoreCollections.WORKSPACE);
const workspaceUrlCollection = db.collection(FirestoreCollections.WORKSPACE_URL);
const workspaceUserCollection = db.collection(FirestoreCollections.WORKSPACE_USER);
const userCollection = db.collection(FirestoreCollections.USER);
const workspaceInviteCollection = db.collection(FirestoreCollections.WORKSPACE_INVITE);
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
    const newWorkspaceId = newWorkspaceRef.id;
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
    transaction.set(workspaceUrlRef, { url: input.url, workspaceId: newWorkspaceId });
    // Add the workspace to the user's document.
    const userRef = userCollection.doc(input.userId);
    transaction.update(userRef, {
      workspaces: firebase.firestore.FieldValue.arrayUnion({
        id: newWorkspaceId,
        name: input.name
      })
    });
    // Create a composite document for a Workspace User.
    const workspaceUserRef = workspaceUserCollection.doc(
      `${newWorkspaceId}_${input.userId}`
    );
    transaction.set(workspaceUserRef, {
      workspaceId: newWorkspaceId,
      userId: input.userId,
      userDisplayName: input.userDisplayName,
      userEmail: input.userEmail,
      userPhotoURL: input.userPhotoURL,
      userRole: "owner"
    });
    // Return the newWorkspaceRef.
    return newWorkspaceRef;
  });
}

interface CreateWorkspaceInviteParams {
  email: string;
  workspaceId: string;
  workspaceName: string;
  invitedByUserDisplayName: string;
  invitedByUserId: string;
}

export function createWorkspaceInvite(params: CreateWorkspaceInviteParams) {
  return workspaceInviteCollection.add({
    ...params,
    status: WorkspaceInviteStatus.SENT,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  } as WorkspaceInvite);
}

export function workspaceUsersListener(
  workspaceId: string,
  onSuccess: (workspaceUser: WorkspaceUser) => void
) {
  return workspaceUserCollection
    .where("workspaceId", "==", workspaceId)
    .limit(10)
    .onSnapshot((workspaceUsersQuerySnapshot) =>
      workspaceUsersQuerySnapshot.forEach((workspaceUser) =>
        onSuccess(workspaceUser.data() as WorkspaceUser)
      )
    );
}
