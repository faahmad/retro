import {
  joinWorkspaceTransaction,
  JoinWorkspaceTransactionParams
} from "../services/join-workspace-transaction";
import { Workspace } from "../types/workspace";
import { WorkspaceInvite } from "../types/workspace-invite";

export function useJoinWorkspace() {
  async function joinWorkspace(input: {
    workspaceId: Workspace["id"];
    workspaceName: Workspace["name"];
    auth?: any;
    workspaceInviteId?: WorkspaceInvite["id"];
  }) {
    console.log("Joining workspace...");
    const params: JoinWorkspaceTransactionParams = {
      auth: input.auth,
      workspaceId: input.workspaceId,
      workspaceName: input.workspaceName,
      workspaceInviteId: input.workspaceInviteId
    };

    await joinWorkspaceTransaction(params);

    return;
  }
  return joinWorkspace;
}
