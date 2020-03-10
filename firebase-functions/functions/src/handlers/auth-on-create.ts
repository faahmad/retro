import { app, auth } from "firebase-admin";
import { addUserToDefaultContactList } from "../services/mailjet-service";

export const handleAuthOnCreate = (firebaseAdmin: app.App) => async (
  user: auth.UserRecord
) => {
  console.log("New user!");
  console.log(user);
  console.log("\n");

  const createContactResponse: any = await addUserToDefaultContactList(
    user.email!,
    user.displayName!
  );
  console.log(
    `${user.email!} has been added to the All Users contact list in Mailjet.`
  );
  console.log(createContactResponse.body);
  console.log("\n");

  return;
};
