import * as React from "react";
import { retroListener } from "../services/retro-listener";
import { Retro } from "../types/retro";
import { useCreateRetroItem } from "../hooks/use-create-retro-item";
import { RetroItem } from "../types/retro-item";

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
  RETRO_ADD_ITEM = "retro_add_item"
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

type RetroAction =
  | RetroActionLoading
  | RetroActionSnapshot
  | RetroActionError
  | RetroActionAddItem;

export function useRetroState(retroId: Retro["id"]) {
  const [state, dispatch] = React.useReducer(retroStateReducer, initialState);
  const createRetroItem = useCreateRetroItem();

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
    console.log("handleRetroSnapshot");
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
      return;
    } catch (error) {
      dispatch({ type: RetroActionTypes.RETRO_ERROR, payload: error });
    }
  };

  return { state, handleAddItem };
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
    default: {
      return state;
    }
  }
}
