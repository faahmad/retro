import { Workspace } from "./workspace";

export interface User {
  id: string;
  createdAt: string;
  displayName: string;
  email: string;
  phoneNumber: string | null;
  photoUrl: string;
  workspaces: UserWorkspace[];
}

export interface UserWorkspace {
  id: Workspace["id"];
  name: Workspace["name"];
  url: Workspace["url"];
}
