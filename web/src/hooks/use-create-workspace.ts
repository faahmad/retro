import { createWorkspaceTransaction } from "../services/create-workspace-transaction";
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

    return workspaceRef;
  }
  return createWorkspace;
}
