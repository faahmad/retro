import { client } from "../lib/mailjet";
import { mailjet } from "../constants/mailjet";
import { projectIds } from "../constants/project-ids";

const isProd = process.env.GCLOUD_PROJECT === projectIds.prod;
const mailjetConfig = {
  version: "v3",
  perform_api_call: isProd
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

export const sendInvitationMailer = (email: string, senderFirstName: string) => {
  return client.post("send", mailjetConfig).request({
    Messages: [
      {
        To: [
          {
            Email: email
          }
        ],
        TemplateID: mailjet.templateIds.INVITATION_RECEIVED,
        TemplateLanguage: true,
        Variables: {
          email,
          firstname: senderFirstName || "Your Team"
        }
      }
    ]
  });
};
