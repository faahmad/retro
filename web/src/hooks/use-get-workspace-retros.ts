import { getWorkspaceRetros } from "../services/get-workspace-retros";
import * as React from "react";
import { Retro } from "../types/retro";
import { Workspace } from "../types/workspace";

export function useGetWorkspaceRetros(workspaceId: Workspace["id"]) {
  const [retros, setRetros] = React.useState<Retro[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    getWorkspaceRetros({ workspaceId }).then((r) => {
      // console.log(r);
      return setRetros(r);
    });
  }, [workspaceId]);

  // function handleGetWorkspaceRetros(workspaceId: Workspace["id"]) {
  //   return getWorkspaceRetros({ workspaceId });
  // }

  // function handleGetMore() {
  // }

  return { isLoading, retros };
}
