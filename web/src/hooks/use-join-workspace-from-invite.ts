import { joinWorkspaceFromInviteTransaction } from "../services/join-workspace-from-invite-transaction";
import { WorkspaceInvite } from "../types/workspace-invite";
import { useCurrentUser } from "./use-current-user";
import { AnalyticsEvent, useAnalyticsEvent } from "./use-analytics-event";

export function useJoinWorkspaceFromInvite() {
  const currentUser = useCurrentUser();
  const trackEvent = useAnalyticsEvent();
  async function joinWorkspace(workspaceInvite: WorkspaceInvite) {
    if (!currentUser.auth) {
      return;
    }

    const params = {
      auth: currentUser.auth,
      workspaceId: workspaceInvite.workspaceId,
      workspaceName: workspaceInvite.workspaceName,
      workspaceInviteId: workspaceInvite.id
    };

    const workspaceInviteRef = await joinWorkspaceFromInviteTransaction(params);

    trackEvent(AnalyticsEvent.WORKSPACE_JOINED, params);

    return workspaceInviteRef;
  }
  return joinWorkspace;
}
