import * as React from "react";
import { getWorkspace } from "../services/workspace-service";

const SubscriptionStatusContext = React.createContext<{
  isLoading: boolean;
  isActive: boolean | null;
}>({
  isLoading: true,
  isActive: null
});

export function SubscriptionStatusProvider({ workspaceId, children }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isActive, setIsActive] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const handleGetSubscriptionStatus = async (workspaceId) => {};
  }, [workspaceId]);
}
