import { createRetroTransaction } from "../services/create-retro-transaction";
import { Workspace } from "../types/workspace";
import { useCurrentUser } from "./use-current-user";

export function useCreateRetro() {
  const currentUser = useCurrentUser();
  async function createRetro(workspaceId: Workspace["id"]) {
    if (!currentUser.auth) {
      return;
    }
    const { uid } = currentUser.auth;

    const params = {
      workspaceId,
      userId: uid
    };

    const newRetro = await createRetroTransaction(params);

    return newRetro;
  }
  return createRetro;
}
