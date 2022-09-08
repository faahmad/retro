import { Workspace } from "../types/workspace";
import { useUpdateWorkspaceUser } from "./use-update-workspace-user";
import { useCurrentUser } from "./use-current-user";
import React from "react";
import { getServerTimestamp } from "../utils/firestore-utils";

export function useUpdateLastActive(workspaceId: Workspace["id"]) {
  const currentUser = useCurrentUser();
  const updateWorkspaceUser = useUpdateWorkspaceUser(workspaceId);

  React.useEffect(() => {
    if (currentUser.auth?.uid) {
      updateWorkspaceUser(currentUser.auth.uid, {
        lastActiveAt: getServerTimestamp()
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
