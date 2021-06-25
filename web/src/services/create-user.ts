import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";

const db = firebase.firestore();
const userCollection = db.collection(FirestoreCollections.USER);

export function createUser({ user }: firebase.auth.UserCredential) {
  const params = {
    id: user?.uid,
    email: user?.email!,
    displayName: user?.displayName || "",
    photoUrl: user?.photoURL,
    phoneNumber: user?.phoneNumber,
    createdAt: user?.metadata.creationTime
  };
  return userCollection.doc(params.id).set(params);
}
