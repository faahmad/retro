import * as React from "react";
import { getWorkspaceInvitesByEmail } from "../services/get-workspace-invites-by-email";
import { WorkspaceInvite } from "../types/workspace-invite";

export function useGetWorkspaceInvitesByEmail(email?: string | null) {
  const [workspaceInvites, setWorkspaceInvites] = React.useState<WorkspaceInvite[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    if (!email) {
      return;
    }
    setIsLoading(true);
    getWorkspaceInvitesByEmail(email)
      .then((invites) => setWorkspaceInvites(invites))
      .then(() => setIsLoading(false));
  }, [email]);
  return { data: workspaceInvites, loading: isLoading };
}
