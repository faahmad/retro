import * as React from "react";
import { getStripeSubscriptionStatus } from "../services/stripe-service";

interface SubscriptionStatusState {
  isLoading: boolean;
  isActive: boolean | null;
  status: string | null;
}

const subscriptionStatusStateInitialValues = {
  isLoading: true,
  isActive: null,
  status: null
};

const SubscriptionStatusContext = React.createContext<SubscriptionStatusState>(
  subscriptionStatusStateInitialValues
);

enum SubscriptionStatusActionTypes {
  LOADING = "loading",
  SUCCESS = "success"
}

interface SubscriptionStatusAction {
  type: SubscriptionStatusActionTypes;
  status: string | null;
}

function subscriptionStatusReducer(
  state: SubscriptionStatusState,
  action: SubscriptionStatusAction
) {
  switch (action.type) {
    case SubscriptionStatusActionTypes.LOADING: {
      return { ...state, isLoading: true, isActive: null, status: null };
    }
    case SubscriptionStatusActionTypes.SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isActive: action.status === "active" || action.status === "trialing",
        status: action.status
      };
    }
  }
}

export const SubscriptionStatusProvider: React.FC<{ workspaceId: string }> = ({
  workspaceId,
  children
}) => {
  const [state, dispatch] = React.useReducer(
    subscriptionStatusReducer,
    subscriptionStatusStateInitialValues
  );

  React.useEffect(() => {
    if (!workspaceId) {
      return;
    }
    const handleGetSubscriptionStatus = async (workspaceId: string) => {
      dispatch({ type: SubscriptionStatusActionTypes.LOADING, status: null });
      const { data } = await getStripeSubscriptionStatus(workspaceId);
      dispatch({ type: SubscriptionStatusActionTypes.SUCCESS, status: data.status });
      return;
    };
    handleGetSubscriptionStatus(workspaceId);
    return;
  }, [workspaceId]);

  return (
    <SubscriptionStatusContext.Provider value={state}>
      {children}
    </SubscriptionStatusContext.Provider>
  );
};

export const useSubscriptionStatusContext = () =>
  React.useContext(SubscriptionStatusContext);
