import firebase from "../lib/firebase";

export function getServerTimestamp() {
  return firebase.firestore.FieldValue.serverTimestamp();
}

export function increment() {
  return firebase.firestore.FieldValue.increment(1);
}

export function arrayUnion(element: any) {
  return firebase.firestore.FieldValue.arrayUnion(element);
}
