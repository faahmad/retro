import { createWorkspaceTransaction } from "../services/create-workspace-transaction";
import { AnalyticsEvent, useAnalyticsEvent } from "./use-analytics-event";
import { useCurrentUser } from "./use-current-user";

interface CreateWorkspaceInput {
  name: string;
  url: string;
  allowedEmailDomain: string;
}
export function useCreateWorkspace() {
  const currentUser = useCurrentUser();
  const trackEvent = useAnalyticsEvent();
  async function createWorkspace(input: CreateWorkspaceInput) {
    if (!currentUser.auth) {
      return;
    }
    const { uid, email, photoURL, displayName } = currentUser.auth;
    const { name, url, allowedEmailDomain } = input;

    const params = {
      name,
      url,
      allowedEmailDomain,
      userId: uid,
      userEmail: email!,
      userPhotoURL: photoURL!,
      userDisplayName: displayName!
    };

    const workspaceRef = await createWorkspaceTransaction(params);

    trackEvent(AnalyticsEvent.WORKSPACE_CREATED, params);

    return workspaceRef;
  }
  return createWorkspace;
}
