import { Workspace } from "../types/workspace";
import { useUpdateWorkspaceUser } from "./use-update-workspace-user";
import { useCurrentUser } from "./use-current-user";
import React from "react";
import { getServerTimestamp } from "../utils/firestore-utils";
import * as Sentry from "@sentry/react";

export function useUpdateLastActive(workspaceId: Workspace["id"]) {
  const currentUser = useCurrentUser();
  const updateWorkspaceUser = useUpdateWorkspaceUser(workspaceId);

  React.useEffect(() => {
    if (currentUser.data?.id) {
      try {
        updateWorkspaceUser(currentUser.data.id, {
          lastActiveAt: getServerTimestamp()
        });
      } catch (error) {
        Sentry.captureException(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
