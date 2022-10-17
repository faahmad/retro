import * as React from "react";
import { RouteComponentProps, useHistory, useParams } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { useRetroState, RetroStateStatus } from "../hooks/use-retro-state";
import { Retro } from "../types/retro";
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
import { getIsFacilitator } from "../utils/getIsFacilitator";
import { RetroStep } from "../components/RetroBoardStageStepper";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "../components/Button";
import { LoadingText } from "../components/LoadingText";
import { BannerWorkspaceSubscription } from "../components/BannerWorkspaceSubscription";

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
  const history = useHistory();

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
        <p className="text-blue mb-2">
          Something went wrong when trying to open this retro. It may have been deleted or
          you no longer have access.
        </p>
        <p className="text-blue mb-2 text-sm text-gray">
          Error message: {error?.message}
        </p>
        <Button
          className="text-red shadow border"
          onClick={() => {
            history.push(`/workspaces/${workspaceState.id}`);
          }}
        >
          Back to Dashboard
        </Button>
      </PageContainer>
    );
  }

  function getStageExplainerText(stage?: RetroStep["name"]) {
    if (!stage) {
      return "";
    }

    const map = {
      Reflect: "Write down your reflections. Everything you write is anonymous.",
      Vote: "Add a thumbs up to the reflections you agree with and want to discuss.",
      Discuss:
        "The facilitator should go through the reflections and add actions if needed.",
      Review: "Great job! The retro is over. Here's a summary."
    };

    return map[stage];
  }

  const isFacilitator = getIsFacilitator(data!, currentUserId);
  const isSubscriptionTrialing = workspaceState.subscriptionStatus === "trialing";
  const isSubscriptionActive = workspaceState.subscriptionStatus === "active";
  const isAccountActive = isSubscriptionTrialing || isSubscriptionActive;

  const isWorkspaceAdmin = workspaceState?.users?.[currentUserId]?.userRole === "owner";

  if (status === RetroStateStatus.SUCCESS && data !== null) {
    return (
      <ErrorBoundary FallbackComponent={RetroErrorFallback}>
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
            workspaceId={workspaceState.id}
          />
          <div className="px-8">
            {!isAccountActive && (
              <BannerWorkspaceSubscription
                workspaceId={workspaceState.id}
                isWorkspaceAdmin={isWorkspaceAdmin}
                subscriptionStatus={workspaceState.subscriptionStatus}
                subscriptionTrialEnd={workspaceState.subscriptionTrialEnd}
                paymentMethodId={workspaceState.paymentMethodId}
              />
            )}
          </div>
          <div className="px-8 mt-4 flex items-center max-w-l">
            <InformationCircleIcon className="h-4 w-4 text-gray mr-2" />
            <p className="text-gray text-xs">{getStageExplainerText(data?.stage)}</p>
          </div>
          <PageContainer className={"my-5 px-8 m-auto"}>
            {data?.stage === "Review" && <RetroReviewPage />}

            {data?.stage === "Discuss" && <RetroBoardPresentationMode />}

            {(data?.stage === "Reflect" || data?.stage === "Vote") && (
              <RetroBoard
                isAccountActive={isAccountActive}
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
      </ErrorBoundary>
    );
  }

  // This should never happen TBH.
  return null;
};

function RetroErrorFallback() {
  const handleOnClick = () => {
    // resetErrorBoundary();
    // window.location.reload();
    // return;
  };

  return (
    <PageContainer>
      <div className="text-center text-red">
        <LoadingText>
          Oops, something went wrong. Please refresh your browser.
        </LoadingText>
        <Button className="shadow border" onClick={handleOnClick}>
          Back to Dashboard
        </Button>
      </div>
    </PageContainer>
  );
}
