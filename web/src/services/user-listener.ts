import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { User } from "../types/user";

const db = firebase.firestore();
const userCollection = db.collection(FirestoreCollections.USER);

export function userListener(userId: string, onSuccess: (user: User) => void) {
  return userCollection
    .doc(userId)
    .onSnapshot((userSnapshot) =>
      onSuccess({ id: userSnapshot.id, ...userSnapshot.data() } as User)
    );
}
