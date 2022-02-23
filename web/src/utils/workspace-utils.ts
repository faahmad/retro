import { UserWorkspace } from "../types/user";
import { Workspace } from "../types/workspace";
import { CurrentUserContextValues } from "../contexts/CurrentUserContext";
import { RetroColumnType } from "../types/retro-column";

export function getWorkspaceFromCurrentUser(
  currentUser: CurrentUserContextValues
): UserWorkspace | null {
  if (currentUser?.data?.workspaces) {
    return currentUser?.data?.workspaces[0];
  }
  return null;
}

export function getRootUrlForWorkspace(workspace: Workspace | UserWorkspace) {
  return `/workspaces/${workspace.id}`;
}

export function getCountKeyByType(type: RetroColumnType) {
  const typeToCountKeyMap = {
    [RetroColumnType.GOOD]: "goodCount",
    [RetroColumnType.BAD]: "badCount",
    [RetroColumnType.ACTIONS]: "actionsCount"
  };
  return typeToCountKeyMap[type];
}
