import * as React from "react";
import { getWorkspaceInvitesByEmail } from "../services/get-workspace-invites-by-email";
import { WorkspaceInvite } from "../types/workspace-invite";

export function useGetWorkspaceInvitesByEmail(email?: string | null) {
  const [workspaceInvites, setWorkspaceInvites] = React.useState<WorkspaceInvite[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!email) {
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    setIsLoading(true);
    const handleGetWorkspaceInvitesByEmail = async () => {
      const invites = await getWorkspaceInvitesByEmail(email);
      if (isMounted) {
        setWorkspaceInvites(invites);
        setIsLoading(false);
      }
    };
    handleGetWorkspaceInvitesByEmail();
    return () => {
      isMounted = false;
    };
  }, [email]);
  return { data: workspaceInvites, loading: isLoading };
}
