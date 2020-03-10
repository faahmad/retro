import { client } from "../lib/mailjet";
import { mailjet } from "../constants/mailjet";
import { projectIds } from "../constants/project-ids";

const CONFIG_OPTIONS = {
  version: "v3",
  perform_api_call: process.env.GCLOUD_PROJECT === projectIds.prod
};

export const addUserToDefaultContactList = (email: string, name: string) => {
  return client
    .post("contactslist", CONFIG_OPTIONS)
    .id(mailjet.contactLists.ALL_USERS)
    .action("managecontact")
    .request({
      Email: email,
      Name: name,
      Action: "addnoforce"
    });
};
