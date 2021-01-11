import * as React from "react";
import { WorkspaceStateContext } from "../contexts/WorkspaceStateContext";

export function useWorkspaceState() {
  return React.useContext(WorkspaceStateContext);
}
