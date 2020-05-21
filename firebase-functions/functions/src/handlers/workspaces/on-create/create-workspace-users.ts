import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Workspace } from "../../../types/workspace";
import { User } from "../../../types/user";

const db = admin.firestore();

/**
 * When a Workspace is created this function
 * initializes workspaceUsers with the owner's data.
 */
export const createWorkspaceUsers = functions.firestore
  .document("workspaces/{workspaceId}")
  .onCreate(async (snapshot) => {
    const workspace = snapshot.data() as Workspace;
    const userSnapshot = await db.collection("users").doc(workspace.owner.id).get();
    const user = userSnapshot.data() as User;
    return db
      .collection("workspaceUsers")
      .doc(workspace.id)
      .set({
        workspaceId: workspace.id,
        users: {
          [user.id]: {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            joinedAt: admin.firestore.FieldValue.serverTimestamp()
          }
        }
      });
  });
