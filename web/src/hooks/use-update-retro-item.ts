import { updateRetroItem } from "../services/update-retro-item";
import { RetroItem } from "../types/retro-item";

export function useUpdateRetroItem() {
  const handleUpdateRetroItem = (
    id: RetroItem["id"],
    updatedFields: Partial<RetroItem>
  ) => {
    return updateRetroItem(id, updatedFields);
  };
  return handleUpdateRetroItem;
}
