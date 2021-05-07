import { Workspace } from "./workspace";

export interface User {
  id: string;
  createdAt: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  photoUrl?: string;
  workspaces?: UserWorkspace[];
  role?: "owner" | "member";
}

export interface UserWorkspace {
  id: Workspace["id"];
  name: Workspace["name"];
  url: Workspace["url"];
}

export type CreateUserParams = User;
