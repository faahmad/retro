import firebase from "../lib/firebase";

export function getServerTimestamp() {
  return firebase.firestore.FieldValue.serverTimestamp();
}

export function increment() {
  return firebase.firestore.FieldValue.increment(1);
}

export function decrement() {
  return firebase.firestore.FieldValue.increment(-1);
}

export function deleteValue() {
  return firebase.firestore.FieldValue.delete();
}

export function arrayUnion<Type>(element: Type) {
  return firebase.firestore.FieldValue.arrayUnion(element);
}
