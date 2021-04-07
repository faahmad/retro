import {
  joinWorkspaceTransaction,
  JoinWorkspaceTransactionParams
} from "../services/join-workspace-transaction";
import { Workspace } from "../types/workspace";
import { WorkspaceInvite } from "../types/workspace-invite";
import { useCurrentUser } from "./use-current-user";

export function useJoinWorkspace() {
  const currentUser = useCurrentUser();
  async function joinWorkspace(input: {
    workspaceId: Workspace["id"];
    workspaceName: Workspace["name"];
    workspaceInviteId?: WorkspaceInvite["id"];
  }) {
    if (!currentUser.auth) {
      return;
    }

    const params: JoinWorkspaceTransactionParams = {
      auth: currentUser.auth,
      workspaceId: input.workspaceId,
      workspaceName: input.workspaceName,
      workspaceInviteId: input.id
    };

    await joinWorkspaceTransaction(params);

    return;
  }
  return joinWorkspace;
}
