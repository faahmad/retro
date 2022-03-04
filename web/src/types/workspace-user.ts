import { User } from "./user";
import { Workspace } from "./workspace";

export interface WorkspaceUser {
  userDisplayName: User["displayName"] | null;
  userEmail: User["email"] | null;
  userId: User["id"];
  userPhotoURL: User["photoUrl"] | null;
  userRole: "member" | "owner";
  workspaceId: Workspace["id"];
}

export interface WorkspaceUsersMap {
  [userId: string]: WorkspaceUser;
}
