import { getWorkspaceRetros } from "../services/get-workspace-retros";
import * as React from "react";
import { Retro } from "../types/retro";
import { Workspace } from "../types/workspace";

export function useGetWorkspaceRetros() {
  const [retros, setRetros] = React.useState<Retro[]>([]);
  function handleGetWorkspaceRetros(workspaceId: Workspace["id"]) {
    return getWorkspaceRetros({ workspaceId });
  }

  // function handleGetMore() {
  // }

  return { getWorkspaceRetros: handleGetWorkspaceRetros };
}
