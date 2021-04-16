import * as React from "react";
import { retroListener } from "../services/retro-listener";
import { Retro } from "../types/retro";
import { useCreateRetroItem } from "../hooks/use-create-retro-item";
import { useDragDropRetroItem } from "../hooks/use-drag-drop-retro-item";
import { useUpdateRetroItem } from "../hooks/use-update-retro-item";
import { RetroItem } from "../types/retro-item";
import { RetroColumn, RetroColumnType } from "../types/retro-column";
import omitBy from "lodash/omitBy";
import isNil from "lodash/isNil";
import { User } from "../types/user";
import { decrement, deleteValue, increment } from "../utils/firestore-utils";
import { AnalyticsEvent, useAnalyticsEvent } from "./use-analytics-event";
import * as Sentry from "@sentry/react";
import { useDeleteRetroItem } from "../hooks/use-delete-retro-item";

export enum RetroStateStatus {
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR"
}

type RetroStateLoading = {
  status: RetroStateStatus.LOADING;
  data: null;
  error: null;
};

type RetroStateSuccess = {
  status: RetroStateStatus.SUCCESS;
  data: Retro;
  error: null;
};

type RetroStateError = {
  status: RetroStateStatus.ERROR;
  data: Retro | null;
  error: Error;
};

export type RetroStateValues = RetroStateLoading | RetroStateSuccess | RetroStateError;

const initialState: RetroStateValues = {
  status: RetroStateStatus.LOADING,
  data: null,
  error: null
};

enum RetroActionTypes {
  RETRO_LOADING = "retro_loading",
  RETRO_SNAPSHOT = "retro_snapshot",
  RETRO_ERROR = "retro_error",
  RETRO_ADD_ITEM = "retro_add_item",
  RETRO_UPDATE_ITEM = "retro_update_item",
  RETRO_DRAG_DROP_ITEM = "retro_drag_drop_item",
  RETRO_DELETE_ITEM = "retro_delete_item"
}

type RetroActionLoading = {
  type: RetroActionTypes.RETRO_LOADING;
};

type RetroActionSnapshot = {
  type: RetroActionTypes.RETRO_SNAPSHOT;
  payload: Retro;
};

type RetroActionError = {
  type: RetroActionTypes.RETRO_ERROR;
  payload: Error;
};

type RetroActionAddItem = {
  type: RetroActionTypes.RETRO_ADD_ITEM;
  payload: RetroItem;
};

type RetroActionEditItem = {
  type: RetroActionTypes.RETRO_UPDATE_ITEM;
  payload: {
    id: RetroItem["id"];
    content: RetroItem["content"];
  };
};

type RetroActionUpvoteItem = {
  type: RetroActionTypes.RETRO_UPDATE_ITEM;
  payload: {
    id: RetroItem["id"];
    userId: User["id"];
  };
};

type RetroActionDownvoteItem = {
  type: RetroActionTypes.RETRO_UPDATE_ITEM;
  payload: {
    id: RetroItem["id"];
    userId: User["id"];
  };
};

type RetroActionDeleteItem = {
  type: RetroActionTypes.RETRO_DELETE_ITEM;
  payload: {
    retroItemId: RetroItem["id"];
    column: RetroItem["type"];
  };
};

type RetroActionDragDropItem = {
  type: RetroActionTypes.RETRO_DRAG_DROP_ITEM;
  payload: {
    prevColumnType: RetroColumnType;
    prevColumn: RetroColumn;
    nextColumnType?: RetroColumnType;
    nextColumn?: RetroColumn;
  };
};

type RetroAction =
  | RetroActionLoading
  | RetroActionSnapshot
  | RetroActionError
  | RetroActionAddItem
  | RetroActionEditItem
  | RetroActionUpvoteItem
  | RetroActionDownvoteItem
  | RetroActionDragDropItem
  | RetroActionDeleteItem;

export function useRetroState(retroId: Retro["id"]) {
  const [state, dispatch] = React.useReducer(retroStateReducer, initialState);
  const createRetroItem = useCreateRetroItem();
  const dragDropRetroItem = useDragDropRetroItem();
  const updateRetroItem = useUpdateRetroItem();
  const trackEvent = useAnalyticsEvent();
  const deleteRetroItem = useDeleteRetroItem();

  React.useEffect(() => {
    handleRetroLoading();
    const retroListenerUnsubscribeFn = retroListener(retroId, handleRetroSnapshot);
    return () => {
      retroListenerUnsubscribeFn();
    };
  }, [retroId]);

  const handleRetroLoading = () => {
    return dispatch({ type: RetroActionTypes.RETRO_LOADING });
  };

  const handleRetroSnapshot = (retro: Retro) => {
    return dispatch({ type: RetroActionTypes.RETRO_SNAPSHOT, payload: retro });
  };

  const handleAddItem = async (input: any) => {
    try {
      const newRetroItem = await createRetroItem({
        retroId,
        workspaceId: input.workspaceId,
        content: input.content,
        type: input.type
      });
      if (!newRetroItem) {
        throw new Error("handleAddItem failed.");
      }
      dispatch({ type: RetroActionTypes.RETRO_ADD_ITEM, payload: newRetroItem });
      trackEvent(AnalyticsEvent.RETRO_ITEM_CREATED, {
        ...newRetroItem,
        createdBy:
          state.data?.createdById === newRetroItem.createdByUserId
            ? "retro-owner"
            : "member"
      });
      return;
    } catch (error) {
      dispatch({ type: RetroActionTypes.RETRO_ERROR, payload: error });
      Sentry.captureException(error);
      return;
    }
  };

  const handleEditItem = async (input: {
    id: RetroItem["id"];
    content: RetroItem["content"];
  }) => {
    try {
      dispatch({ type: RetroActionTypes.RETRO_UPDATE_ITEM, payload: input });
      await updateRetroItem(input.id, { content: input.content });
      trackEvent(AnalyticsEvent.RETRO_ITEM_EDITED, {
        retroItemId: input.id
      });
      return;
    } catch (error) {
      dispatch({ type: RetroActionTypes.RETRO_ERROR, payload: error });
      Sentry.captureException(error);
      return;
    }
  };

  const handleLikeItem = async (input: { id: RetroItem["id"]; userId: User["id"] }) => {
    try {
      dispatch({ type: RetroActionTypes.RETRO_UPDATE_ITEM, payload: input });
      await updateRetroItem(input.id, {
        [`likedBy.${input.userId}`]: input.userId,
        // @ts-ignore
        likeCount: increment()
      });
      trackEvent(AnalyticsEvent.RETRO_ITEM_LIKED, {
        retroItemId: input.id,
        likedBy: state.data?.createdById === input.userId ? "retro-owner" : "member"
      });
      return;
    } catch (error) {
      dispatch({ type: RetroActionTypes.RETRO_ERROR, payload: error });
      Sentry.captureException(error);
      return;
    }
  };

  const handleUnlikeItem = async (input: { id: RetroItem["id"]; userId: User["id"] }) => {
    try {
      dispatch({ type: RetroActionTypes.RETRO_UPDATE_ITEM, payload: input });
      await updateRetroItem(input.id, {
        [`likedBy.${input.userId}`]: deleteValue(),
        // @ts-ignore
        likeCount: decrement()
      });
      return;
    } catch (error) {
      dispatch({ type: RetroActionTypes.RETRO_ERROR, payload: error });
      Sentry.captureException(error);
      return;
    }
  };

  const handleDeleteItem = async (
    retroItemId: RetroItem["id"],
    column: RetroItem["type"]
  ) => {
    dispatch({
      type: RetroActionTypes.RETRO_DELETE_ITEM,
      payload: { retroItemId, column }
    });
    await deleteRetroItem(retroItemId);
    return;
  };

  const handleDragDrop = async (input: {
    retroItemId: string;
    prevColumnType: RetroColumnType;
    prevColumn: RetroColumn;
    nextColumnType?: RetroColumnType;
    nextColumn?: RetroColumn;
  }) => {
    try {
      // Optimistically update the board first to avoid the flicker.
      const localUpdates = {
        prevColumnType: input.prevColumnType,
        prevColumn: input.prevColumn,
        nextColumnType: input.nextColumnType,
        nextColumn: input.nextColumn
      };
      dispatch({ type: RetroActionTypes.RETRO_DRAG_DROP_ITEM, payload: localUpdates });
      const cleanedInput: any = omitBy(input, isNil);
      await dragDropRetroItem({ retroId, ...cleanedInput });
      trackEvent(AnalyticsEvent.RETRO_ITEM_MOVED, {
        prevColumnType: input.prevColumnType,
        nextColumnType: input.nextColumnType
        // TODO: add movedBy "retro-owner" || "member"
      });
    } catch (error) {
      // If the update fails, the items should revert automatically to their spots.
      Sentry.captureException(error);
      return;
    }
  };
  return {
    state,
    handleAddItem,
    handleDragDrop,
    handleEditItem,
    handleLikeItem,
    handleUnlikeItem,
    handleDeleteItem
  };
}

function retroStateReducer(
  state: RetroStateValues,
  action: RetroAction
): RetroStateValues {
  switch (action.type) {
    case RetroActionTypes.RETRO_LOADING: {
      return { status: RetroStateStatus.LOADING, data: null, error: null };
    }
    case RetroActionTypes.RETRO_SNAPSHOT: {
      return { status: RetroStateStatus.SUCCESS, data: action.payload, error: null };
    }
    case RetroActionTypes.RETRO_ERROR: {
      return { status: RetroStateStatus.ERROR, data: null, error: action.payload };
    }
    case RetroActionTypes.RETRO_DELETE_ITEM: {
      const { retroItemId, column } = action.payload;
      if (!state.data) {
        return state;
      }
      let retroItemIds = state.data.retroItemIds;
      // Delete the RetroItemId from the board.
      delete retroItemIds[retroItemId];
      // Remove the RetroItemId from the column.
      const columnToUpdate = state.data.columns[column];
      const items = columnToUpdate.retroItemIds.filter((id) => id !== retroItemId);
      return {
        ...state,
        data: {
          ...state.data,
          retroItemIds,
          columns: {
            ...state.data.columns,
            [column]: {
              ...columnToUpdate,
              retroItemIds: items
            }
          }
        }
      };
    }
    case RetroActionTypes.RETRO_DRAG_DROP_ITEM: {
      const { prevColumn, prevColumnType, nextColumn, nextColumnType } = action.payload;
      const updatedNextColumn =
        nextColumnType && nextColumn ? { [nextColumnType]: nextColumn } : {};
      // @ts-ignore
      return {
        ...state,
        // @ts-ignore
        data: {
          ...state.data,
          // @ts-ignore
          columns: {
            ...state.data?.columns,
            ...updatedNextColumn,
            [prevColumnType]: prevColumn
          }
        }
      };
    }
    default: {
      return state;
    }
  }
}
