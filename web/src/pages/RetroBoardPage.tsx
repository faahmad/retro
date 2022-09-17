import * as React from "react";
import { RouteComponentProps, useParams } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { useRetroState, RetroStateStatus } from "../hooks/use-retro-state";
import { Retro, RetroUserType } from "../types/retro";
import {
  useRetroItemsListener,
  RetroItemsListenerStatus
} from "../hooks/use-retro-items-listener";
import { RetroBoard } from "../components/RetroBoard";
import { useGetWorkspace, WorkspaceStateStatus } from "../hooks/use-get-workspace";
import { AnalyticsPage, useAnalyticsPage } from "../hooks/use-analytics-page";
import { useCurrentUser } from "../hooks/use-current-user";

import { RetroBoardSidePanel } from "../components/RetroBoardSidePanel";

import { RetroBoardPresentationMode } from "../components/RetroBoardPresentationMode";
import { Workspace } from "../types/workspace";
import { useUpdateLastActive } from "../hooks/use-update-last-active";
import { RetroReviewPage } from "./RetroReviewPage";
import { RetroBoardNavigation } from "../components/RetroBoardNavigation";

export const RetroBoardPage: React.FC<RouteComponentProps> = () => {
  useAnalyticsPage(AnalyticsPage.RETRO_BOARD);
  const params = useParams<{ retroId: Retro["id"]; workspaceId: Workspace["id"] }>();
  useUpdateLastActive(params.workspaceId);
  // Important! useRetroItemsListener has to come first!
  // Not the best, I know. But it's MVP.
  const retroItems = useRetroItemsListener(params.retroId);
  const {
    state,
    handleAddItem,
    handleDragDrop,
    handleEditItem,
    handleLikeItem,
    handleUnlikeItem,
    handleDeleteItem,
    handleAddUserToRetro
  } = useRetroState(params.retroId);
  const workspaceState = useGetWorkspace();
  const { data, status, error } = state;
  const currentUser = useCurrentUser();
  const currentUserId = currentUser.data!.id;

  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false);
  function handleToggleSidePanel() {
    setIsSidePanelOpen(!isSidePanelOpen);
  }

  React.useEffect(() => {
    if (status === RetroStateStatus.SUCCESS && !state.data?.userIds[currentUserId]) {
      handleAddUserToRetro(currentUser.data!.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (
    status === RetroStateStatus.LOADING ||
    retroItems.status === RetroItemsListenerStatus.LOADING ||
    workspaceState.status === WorkspaceStateStatus.LOADING
  ) {
    return (
      <PageContainer>
        <p className="text-blue">Fetching retro...</p>
      </PageContainer>
    );
  }

  if (status === RetroStateStatus.ERROR) {
    return (
      <PageContainer>
        <p className="text-blue">{error?.message}</p>
      </PageContainer>
    );
  }

  let isFacilitator = false;
  const currentUserType = data?.userIds[currentUserId];
  // To be backwards compatible, we need to assign the facilitator as the person
  // who created the retro. This is how we used to grant the facilitor role before
  // we introduced the RetroUserType.
  if (
    (currentUserType !== RetroUserType.FACILITATOR ||
      // @ts-expect-error
      currentUserType !== RetroUserType.GUEST) &&
    currentUserId === data?.createdById
  ) {
    isFacilitator = true;
  } else if (currentUserType === RetroUserType.FACILITATOR) {
    isFacilitator = true;
  }

  if (status === RetroStateStatus.SUCCESS && data !== null) {
    return (
      <React.Fragment>
        <RetroBoardSidePanel
          isOwner={isFacilitator}
          isOpen={isSidePanelOpen}
          toggle={handleToggleSidePanel}
        />
        <RetroBoardNavigation
          name={data.name}
          workspaceName={workspaceState.name}
          createdAt={data.createdAt}
          isFacilitator={isFacilitator}
          retroId={params.retroId}
          handleToggleSidePanel={handleToggleSidePanel}
          workspaceUser={workspaceState.users[currentUserId]}
        />
        <PageContainer className={"my-12 px-8 m-auto"}>
          {data?.stage === "Review" && <RetroReviewPage />}

          {data?.stage === "Discuss" && <RetroBoardPresentationMode />}

          {(data?.stage === "Reflect" || data?.stage === "Vote") && (
            <RetroBoard
              retroState={state}
              users={workspaceState.users}
              retroItems={retroItems.data}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onEditItem={(retroItemId, content) =>
                handleEditItem({ content, id: retroItemId })
              }
              onLikeItem={handleLikeItem}
              onUnlikeItem={handleUnlikeItem}
              onDragDrop={handleDragDrop}
            />
          )}
        </PageContainer>
      </React.Fragment>
    );
  }

  // This should never happen TBH.
  return null;
};
