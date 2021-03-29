import { client } from "../lib/mailjet";
import { mailjet } from "../constants/mailjet";

const mailjetConfig = {
  version: "v3.1",
  perform_api_call: true
};

export const addUserToDefaultContactList = (email: string, name: string) => {
  return client
    .post(`contactslist/${mailjet.contactLists.ALL_USERS}/managecontact`, mailjetConfig)
    .request({
      Email: email,
      Name: name,
      Action: "addnoforce"
    });
};
