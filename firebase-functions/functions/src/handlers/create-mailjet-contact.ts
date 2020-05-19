import { auth } from "firebase-admin";
import { addUserToDefaultContactList } from "../services/mailjet-service";

const logger = console;

export const handleCreateMailjetContact = async (user: auth.UserRecord) => {
  logger.log("New user!");
  logger.log(user);
  logger.log("\n");

  const createContactResponse: any = await addUserToDefaultContactList(
    user.email!,
    user.displayName!
  );
  logger.log(`${user.email!} has been added to the All Users contact list in Mailjet.`);
  logger.log(createContactResponse.body);
  logger.log("\n");

  return;
};
