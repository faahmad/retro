import * as functions from "firebase-functions";
import { addUserToDefaultContactList } from "../../../services/mailjet-service";

export const createMailjetContact = functions.auth.user().onCreate(async (user) => {
  return addUserToDefaultContactList(user.email!, user.displayName!);
});
