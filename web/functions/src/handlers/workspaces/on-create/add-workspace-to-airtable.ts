import * as functions from "firebase-functions";
import * as Airtable from "airtable";
import { projectIds } from "../../../constants/project-ids";
import { Workspace } from "../../../types/workspace";
import * as moment from "moment";
import { FirestoreCollections } from "../../../constants/firestore-collections";
const env = functions.config();

const DEV_WORKSPACE_SALES_BASE = "appZ1WIhL1TowGwzY";
const PROD_WORKSPACE_SALES_BASE = "appVxEIOJvEDCkT5E";

const base = new Airtable({
  apiKey: env.airtable.api_key
}).base(
  process.env.GCLOUD_PROJECT === projectIds.prod
    ? PROD_WORKSPACE_SALES_BASE
    : DEV_WORKSPACE_SALES_BASE
);

/**
 * When a Workspace is created, we want to add some
 * data to Airtable so we can track our sales funnel.
 */
export const addWorkspaceToAirtable = functions.firestore
  .document(`${FirestoreCollections.WORKSPACE}/{workspaceId}`)
  .onCreate((workspaceSnapshot) => {
    const workspace = workspaceSnapshot.data() as Workspace;
    const data = {
      Id: workspaceSnapshot.id,
      "Workspace Name": workspace.name,
      "Owner Email": workspace.ownerEmail,
      "Created At": moment(workspace.createdAt).format("L")
    };
    return base("Workspaces").create(data);
  });
