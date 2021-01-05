import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { User } from "../types/user";

const usersCollection = firebase.firestore().collection(FirestoreCollections.USERS);

export async function getUserById(id: User["id"]) {
  const userSnapshot = await usersCollection.doc(id).get();
  return userSnapshot.data() as User;
}
