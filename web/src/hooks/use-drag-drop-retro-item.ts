import {
  dragDropRetroItemTransaction,
  DragDropRetroItemTransactionParams
} from "../services/drag-drop-retro-item-transaction";

export function useDragDropRetroItem() {
  function dragDropRetroItem(params: DragDropRetroItemTransactionParams) {
    return dragDropRetroItemTransaction(params);
  }
  return dragDropRetroItem;
}
