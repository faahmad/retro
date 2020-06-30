import { Workspace } from "../types/workspace";
import { CurrentUserContextValues } from "../contexts/CurrentUserContext";

export function getWorkspaceFromCurrentUser(
  currentUser: CurrentUserContextValues
): Workspace | undefined {
  return currentUser?.data?.user?.workspace;
}

export function getRootUrlForWorkspace(workspace: Workspace) {
  return `/workspaces/${workspace.id}`;
}
