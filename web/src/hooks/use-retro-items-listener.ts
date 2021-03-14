import * as React from "react";
import { retroItemsListener } from "../services/retro-items-listener";
import { RetroItemsMap } from "../types/retro-item";
import { Retro } from "../types/retro";

export enum RetroItemsListenerStatus {
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR"
}

type RetroItemsListenerLoading = {
  status: RetroItemsListenerStatus.LOADING;
  data: null;
  error: null;
};

type RetroItemsListenerSuccess = {
  status: RetroItemsListenerStatus.SUCCESS;
  data: RetroItemsMap;
  error: null;
};

type RetroItemsListenerError = {
  status: RetroItemsListenerStatus.ERROR;
  data: RetroItemsMap | null;
  error: Error;
};

export type RetroItemsListenerValues =
  | RetroItemsListenerLoading
  | RetroItemsListenerSuccess
  | RetroItemsListenerError;

export function useRetroItemsListener(retroId: Retro["id"]) {
  const [data, setData] = React.useState<RetroItemsListenerValues["data"]>(null);
  const [status, setStatus] = React.useState(RetroItemsListenerStatus.LOADING);
  const [error, setError] = React.useState<RetroItemsListenerValues["error"]>(null);

  const handleSuccess = (retroItemsMap: RetroItemsMap) => {
    console.log("handleSuccess");
    setData(retroItemsMap);
    setStatus(RetroItemsListenerStatus.SUCCESS);
    return;
  };

  const handleError = (firebaseError: Error) => {
    setError(firebaseError);
    setStatus(RetroItemsListenerStatus.ERROR);
    return;
  };

  React.useEffect(() => {
    const unsubscribeFn = retroItemsListener(retroId, handleSuccess, handleError);
    return () => unsubscribeFn();
  }, [retroId]);

  return { data, status, error };
}
