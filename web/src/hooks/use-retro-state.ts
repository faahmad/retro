import * as React from "react";
import { retroListener } from "../services/retro-listener";
import { Retro } from "../types/retro";

export enum RetroStateStatus {
  LOADING = "LOADING",
  SUCCESS = "SUCCESS"
}

type RetroStateLoading = {
  status: RetroStateStatus.LOADING;
};

type RetroStateSuccess = {
  status: RetroStateStatus.SUCCESS;
} & Retro;

export type RetroStateValues = RetroStateLoading | RetroStateSuccess;

const initialState: RetroStateValues = {
  status: RetroStateStatus.LOADING
};

enum RetroActionTypes {
  RETRO_LOADING = "retro_loading",
  RETRO_SNAPSHOT = "retro_snapshot"
}

type RetroActionLoading = {
  type: RetroActionTypes.RETRO_LOADING;
};

type RetroActionSnapshot = {
  type: RetroActionTypes.RETRO_SNAPSHOT;
  payload: Retro;
};

type RetroAction = RetroActionLoading | RetroActionSnapshot;

// TODO: Handle if something fails when fetching a Retro.
export function useRetroState(retroId: Retro["id"]) {
  const [state, dispatch] = React.useReducer(retroStateReducer, initialState);

  const handleRetroLoading = () => {
    return dispatch({ type: RetroActionTypes.RETRO_LOADING });
  };
  const handleRetroSnapshot = (retro: Retro) => {
    return dispatch({ type: RetroActionTypes.RETRO_SNAPSHOT, payload: retro });
  };

  React.useEffect(() => {
    handleRetroLoading();
    const retroListenerUnsubscribeFn = retroListener(retroId, handleRetroSnapshot);
    return () => {
      retroListenerUnsubscribeFn();
    };
  }, [retroId]);

  return state;
}

function retroStateReducer(
  state: RetroStateValues,
  action: RetroAction
): RetroStateValues {
  switch (action.type) {
    case RetroActionTypes.RETRO_LOADING: {
      return { status: RetroStateStatus.LOADING };
    }
    case RetroActionTypes.RETRO_SNAPSHOT: {
      return { status: RetroStateStatus.SUCCESS, ...action.payload };
    }
    default: {
      return state;
    }
  }
}
