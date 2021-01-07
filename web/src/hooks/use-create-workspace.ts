import { createWorkspaceTransaction } from "../services/workspace-service";
import { useCurrentUser } from "./use-current-user";

interface CreateWorkspaceInput {
  name: string;
  url: string;
  allowedEmailDomain: string;
}
export function useCreateWorkspace() {
  const currentUser = useCurrentUser();
  async function createWorkspace(input: CreateWorkspaceInput) {
    if (!currentUser.auth) {
      return;
    }
    const { uid, email, photoURL, displayName } = currentUser.auth;
    const { name, url, allowedEmailDomain } = input;

    const workspaceRef = await createWorkspaceTransaction({
      name,
      url,
      allowedEmailDomain,
      userId: uid,
      userEmail: email!,
      userPhotoURL: photoURL!,
      userDisplayName: displayName!
    });

    return workspaceRef;
  }
  return createWorkspace;
}
