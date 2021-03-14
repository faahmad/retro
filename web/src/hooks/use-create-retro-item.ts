import {
  createRetroItemTransaction,
  CreateRetroItemTransactionParams
} from "../services/create-retro-item-transaction";
import { useCurrentUser } from "./use-current-user";

type CreateRetroItemInput = Omit<CreateRetroItemTransactionParams, "userId">;

export function useCreateRetroItem() {
  const currentUser = useCurrentUser();
  async function createRetroItem(input: CreateRetroItemInput) {
    if (!currentUser.auth) {
      return;
    }
    const params: CreateRetroItemTransactionParams = {
      workspaceId: input.workspaceId,
      retroId: input.retroId,
      content: input.content,
      type: input.type,
      userId: currentUser.auth.uid
    };
    const newRetroItem = await createRetroItemTransaction(params);
    return newRetroItem;
  }
  return createRetroItem;
}
