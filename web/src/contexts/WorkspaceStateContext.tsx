import * as React from "react";
import { TODO } from "../types/todo";
import { Workspace } from "../types/workspace";
import { WorkspaceUser } from "../types/workspace-user";
import { WorkspaceInvite } from "../types/workspace-invite";
import { useOnSnapshot } from "../hooks/use-on-snapshot";
import { FirestoreCollections } from "../constants/firestore-collections";
import { workspaceUsersListener } from "../services/workspace-service";

enum WorkspaceStateStatus {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error"
}

enum WorkspaceStateActionTypes {
  WORKSPACE_SNAPSHOT = "workspace_snapshot",
  WORKSPACE_USER_SNAPSHOT = "workspace_user_snapshot"
}

type WorkspaceStateValues = {
  status: WorkspaceStateStatus;
  error: string | null;
  isActive: boolean;
  users: WorkspaceUser[];
  invitedUsers: WorkspaceInvite[];
} & Workspace;

const initialState: WorkspaceStateValues = {
  status: WorkspaceStateStatus.LOADING,
  error: null,
  isActive: false,
  users: [],
  invitedUsers: [],
  id: "",
  name: "",
  url: "",
  ownerId: "",
  ownerEmail: "",
  allowedEmailDomains: [],
  createdAt: "",
  updatedAt: "",
  subscriptionStatus: "",
  subscriptionTrialEnd: null,
  retroItemsData: {
    goodCount: 0,
    badCount: 0,
    actionsCount: 0,
    questionsCount: 0
  }
};

export const WorkspaceStateContext = React.createContext<WorkspaceStateValues>(
  initialState
);

export function WorkspaceStateProvider({
  workspaceId,
  children
}: {
  workspaceId: Workspace["id"];
  children: React.ReactNode;
}) {
  const [values, dispatch] = React.useReducer(workspaceStateReducer, initialState);

  const onWorkspaceSnapshot = useOnSnapshot<Workspace>(
    `${FirestoreCollections.WORKSPACE}/${workspaceId}`
  );
  const handleWorkspaceSnapshot = (workspaceData: Workspace) => {
    return dispatch({
      type: WorkspaceStateActionTypes.WORKSPACE_SNAPSHOT,
      payload: workspaceData
    });
  };
  const handleWorkspaceUsersQuerySnapshot = (workspaceUser: WorkspaceUser) => {
    return dispatch({
      type: WorkspaceStateActionTypes.WORKSPACE_USER_SNAPSHOT,
      payload: workspaceUser
    });
  };

  React.useEffect(() => {
    const workspaceUnsubscribeFn = onWorkspaceSnapshot(handleWorkspaceSnapshot);
    const workspaceUsersUnsubscribeFn = workspaceUsersListener(
      workspaceId,
      handleWorkspaceUsersQuerySnapshot
    );

    return () => {
      workspaceUnsubscribeFn();
      workspaceUsersUnsubscribeFn();
    };
  }, [workspaceId]);

  return (
    <WorkspaceStateContext.Provider value={values}>
      {children}
    </WorkspaceStateContext.Provider>
  );
}

function workspaceStateReducer(
  state: WorkspaceStateValues,
  action: { type: WorkspaceStateActionTypes; payload: TODO }
): WorkspaceStateValues {
  switch (action.type) {
    case WorkspaceStateActionTypes.WORKSPACE_SNAPSHOT: {
      return reduceWorkspace(state, action.payload);
    }
    case WorkspaceStateActionTypes.WORKSPACE_USER_SNAPSHOT: {
      return reduceWorkspaceUser(state, action.payload);
    }
    default: {
      return state;
    }
  }
}

function reduceWorkspace(
  state: WorkspaceStateValues,
  workspaceData?: Workspace
): WorkspaceStateValues {
  if (!workspaceData) {
    return { ...state, error: "Workspace is undefined." };
  }

  const nextState = {
    ...state,
    ...workspaceData,
    status: WorkspaceStateStatus.SUCCESS,
    createdAt: workspaceData.createdAt.toDate(),
    updatedAt: workspaceData.createdAt.toDate(),
    isActive:
      getIsInActiveMode(workspaceData.subscriptionStatus) ||
      getIsInTrialMode(workspaceData.subscriptionStatus)
  };

  return nextState;
}

function getIsInActiveMode(subscriptionStatus: Workspace["subscriptionStatus"]) {
  return subscriptionStatus === "active";
}

function getIsInTrialMode(subscriptionStatus: Workspace["subscriptionStatus"]) {
  return subscriptionStatus === "trialing";
}

function reduceWorkspaceUser(state: WorkspaceStateValues, workspaceUser: WorkspaceUser) {
  return { ...state, users: [...state.users, workspaceUser] };
}
