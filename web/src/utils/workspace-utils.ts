import { UserWorkspace } from "../types/user";
import { Workspace } from "../types/workspace";
import { CurrentUserContextValues } from "../contexts/CurrentUserContext";

export function getWorkspaceFromCurrentUser(
  currentUser: CurrentUserContextValues
): UserWorkspace | null {
  return currentUser?.data?.workspaces[0] || null;
}

export function getRootUrlForWorkspace(workspace: Workspace | UserWorkspace) {
  return `/workspaces/${workspace.id}`;
}
