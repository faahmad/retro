import { Workspace } from "./workspace";

export interface User {
  id: string;
  createdAt: any;
  displayName: string;
  email: string | null;
  phoneNumber: string | null;
  photoUrl: string | null;
  workspaces: UserWorkspace[];
  settings?: UserSettings;
}

export interface UserWorkspace {
  id: Workspace["id"];
  name: Workspace["name"];
  url: Workspace["url"];
}

export interface UserSettings {
  isFullscreen: boolean;
}
