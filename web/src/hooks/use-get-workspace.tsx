import * as React from "react";
import { TODO } from "../types/todo";
import { Workspace } from "../types/workspace";
import { WorkspaceUsersMap } from "../types/workspace-user";
import { WorkspaceInvite } from "../types/workspace-invite";
import { workspaceListener } from "../services/workspace-listener";
import { workspaceUsersListener } from "../services/workspace-users-listener";
import { workspaceInvitesListener } from "../services/workspace-invite-listener";
import { workspaceRetrosListener } from "../services/workspace-retros-listener";
import { Retro } from "../types/retro";
import { useParams } from "react-router-dom";

export enum WorkspaceStateStatus {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error"
}

enum WorkspaceStateActionTypes {
  WORKSPACE_SNAPSHOT = "workspace_snapshot",
  WORKSPACE_USER_SNAPSHOT = "workspace_user_snapshot",
  WORKSPACE_INVITE_SNAPSHOT = "workspace_invite_snapshot",
  WORKSPACE_RETRO_SNAPSHOT = "workspace_retro_snapshot"
}

type WorkspaceStateValues = {
  status: WorkspaceStateStatus;
  error: string | null;
  users: WorkspaceUsersMap;
  invitedUsers: WorkspaceInvite[];
  retros: Retro[];
} & Workspace;

const initialState: WorkspaceStateValues = {
  status: WorkspaceStateStatus.LOADING,
  error: null,
  users: {},
  invitedUsers: [],
  retros: [],
  id: "",
  name: "",
  url: "",
  ownerId: "",
  ownerEmail: "",
  allowedEmailDomains: [],
  createdAt: "",
  updatedAt: "",
  // @ts-ignore
  subscriptionStatus: "",
  subscriptionTrialEnd: 0,
  retroItemsData: {
    goodCount: 0,
    badCount: 0,
    actionsCount: 0,
    questionsCount: 0
  },
  userCount: 0
};

export function useGetWorkspace() {
  const [values, dispatch] = React.useReducer(workspaceStateReducer, initialState);
  const workspaceId = useParams<any>().workspaceId;

  const handleWorkspaceSnapshot = (workspaceData: Workspace) => {
    return dispatch({
      type: WorkspaceStateActionTypes.WORKSPACE_SNAPSHOT,
      payload: workspaceData
    });
  };
  const handleWorkspaceUsersQuerySnapshot = (workspaceUsersMap: WorkspaceUsersMap) => {
    return dispatch({
      type: WorkspaceStateActionTypes.WORKSPACE_USER_SNAPSHOT,
      payload: workspaceUsersMap
    });
  };
  const handleWorkspaceInvitesQuerySnapshot = (workspaceInvites: WorkspaceInvite[]) => {
    return dispatch({
      type: WorkspaceStateActionTypes.WORKSPACE_INVITE_SNAPSHOT,
      payload: workspaceInvites
    });
  };
  const handleWorkspaceRetrosQuerySnapshot = (retros: Retro[]) => {
    return dispatch({
      type: WorkspaceStateActionTypes.WORKSPACE_RETRO_SNAPSHOT,
      payload: retros
    });
  };

  React.useEffect(() => {
    if (!workspaceId) {
      return;
    }

    const workspaceUnsubscribeFn = workspaceListener(
      workspaceId,
      handleWorkspaceSnapshot
    );
    const workspaceUsersUnsubscribeFn = workspaceUsersListener(
      workspaceId,
      handleWorkspaceUsersQuerySnapshot
    );
    const workspaceInvitesUnsubscribeFn = workspaceInvitesListener(
      workspaceId,
      handleWorkspaceInvitesQuerySnapshot
    );
    const workspaceRetrosUnsubscribeFn = workspaceRetrosListener(
      workspaceId,
      handleWorkspaceRetrosQuerySnapshot
    );

    return () => {
      workspaceUnsubscribeFn();
      workspaceUsersUnsubscribeFn();
      workspaceInvitesUnsubscribeFn();
      workspaceRetrosUnsubscribeFn();
    };
  }, [workspaceId]);

  return {
    ...values
  };
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
    case WorkspaceStateActionTypes.WORKSPACE_INVITE_SNAPSHOT: {
      return reduceWorkspaceInvite(state, action.payload);
    }
    case WorkspaceStateActionTypes.WORKSPACE_RETRO_SNAPSHOT: {
      return reduceWorkspaceRetros(state, action.payload);
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
    updatedAt: workspaceData.createdAt.toDate()
  };

  return nextState;
}

function reduceWorkspaceUser(
  state: WorkspaceStateValues,
  workspaceUsersMap: WorkspaceUsersMap
) {
  return { ...state, users: workspaceUsersMap };
}
function reduceWorkspaceInvite(
  state: WorkspaceStateValues,
  workspaceInvites: WorkspaceInvite[]
) {
  return { ...state, invitedUsers: workspaceInvites };
}
function reduceWorkspaceRetros(state: WorkspaceStateValues, retros: Retro[]) {
  return { ...state, retros };
}
