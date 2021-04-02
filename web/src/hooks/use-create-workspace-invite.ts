import { createWorkspaceInvite } from "../services/create-workspace-invite";
import { useCurrentUser } from "./use-current-user";
import { useAnalyticsEvent, AnalyticsEvent } from "./use-analytics-event";

interface CreateWorkspaceInviteInput {
  email: string;
  workspaceId: string;
  workspaceName: string;
}
export function useCreateWorkspaceInvite() {
  const currentUser = useCurrentUser();
  const trackAnalyticsEvent = useAnalyticsEvent();

  async function handleCreateWorkspaceInvite(input: CreateWorkspaceInviteInput) {
    if (!currentUser.auth) {
      return;
    }
    const { uid, displayName } = currentUser.auth;
    const { email, workspaceId, workspaceName } = input;

    const params = {
      email,
      workspaceId,
      workspaceName,
      invitedByUserDisplayName: displayName!,
      invitedByUserId: uid
    };

    await createWorkspaceInvite(params);
    trackAnalyticsEvent(AnalyticsEvent.USER_INVITED, params);

    return params;
  }
  return handleCreateWorkspaceInvite;
}
