import { User } from "./user";
import { Workspace } from "./workspace";

export interface WorkspaceUser {
  userDisplayName: User["displayName"];
  userEmail: User["email"];
  userId: User["id"];
  userPhotoURL: User["photoUrl"];
  userRole: User["role"];
  workspaceId: Workspace["id"];
}
