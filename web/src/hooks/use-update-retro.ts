import { updateRetro } from "../services/update-retro";
import { Retro } from "../types/retro";

export function useUpdateRetro() {
  const handleUpdateRetro = (id: Retro["id"], updatedFields: Partial<Retro>) => {
    return updateRetro(id, updatedFields);
  };
  return handleUpdateRetro;
}
