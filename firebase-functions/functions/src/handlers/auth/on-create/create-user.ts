import * as functions from "firebase-functions";
import { firebaseAdmin } from "../../../lib/firebase-admin";
import { CreateUserParams } from "../../../types/user";

const db = firebaseAdmin.firestore();

/**
 * When an auth user is created,
 * this function creates a user document.
 */
export const createUser = functions.auth.user().onCreate(async (user) => {
  const params: CreateUserParams = {
    id: user.uid,
    email: user.email!,
    displayName: user.displayName || "",
    photoUrl: user.photoURL,
    phoneNumber: user.phoneNumber,
    createdAt: user.metadata.creationTime
  };
  return db.collection("users").doc(user.uid).set(params);
});
