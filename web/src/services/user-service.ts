import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { User } from "../types/user";
import { Workspace } from "../types/workspace";

const userCollection = firebase.firestore().collection(FirestoreCollections.USER);

export async function getUserById(id: User["id"]) {
  const userSnapshot = await userCollection.doc(id).get();
  return { id: userSnapshot.id, ...userSnapshot.data() };
}

interface UserWorkspaceData {
  id: Workspace["id"];
  name: Workspace["name"];
}
export function addWorkspaceToUser(userId: string, workspaceData: UserWorkspaceData) {
  const userRef = userCollection.doc(userId);
  return userRef;
}
