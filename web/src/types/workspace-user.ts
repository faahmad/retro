import { TODO } from "./todo";
import { User } from "./user";
import { Workspace } from "./workspace";

export interface WorkspaceUser {
  userDisplayName: User["displayName"] | null;
  userEmail: User["email"] | null;
  userId: User["id"];
  userPhotoURL: User["photoUrl"] | null;
  userRole: "member" | "owner";
  workspaceId: Workspace["id"];
  lastActiveAt?: TODO;
}

export interface WorkspaceUsersMap {
  [userId: string]: WorkspaceUser;
}
