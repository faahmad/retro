import React from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import retroEmptyImage from "../assets/images/retro-empty-image.svg";
import { Footer } from "../components/Footer";
import { PageContainer } from "../components/PageContainer";
import { UpgradeToProBanner } from "../components/UpgradeToProBanner";
import { BannerTrialEnded } from "../components/BannerTrialEnded";
import { useCurrentUser } from "../hooks/use-current-user";
import { Retro } from "../types/retro";
import { Workspace } from "../types/workspace";
import { useCreateRetro } from "../hooks/use-create-retro";
import { RetroCard } from "../components/RetroCard";
import { useAnalyticsPage, AnalyticsPage } from "../hooks/use-analytics-page";
import { useAnalyticsEvent, AnalyticsEvent } from "../hooks/use-analytics-event";
import { useGetWorkspace } from "../hooks/use-get-workspace";
import { Navbar } from "../components/Navbar";
import { ActionItemsList } from "../components/RetroBoardPresentationMode";
import { useUpdateLastActive } from "../hooks/use-update-last-active";
import { WorkspaceUsersMap } from "../types/workspace-user";
import { User } from "../types/user";
import { DeleteRetroModal } from "../components/DeleteRetroModal";
import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { useParams } from "react-router-dom";
import * as Sentry from "@sentry/react";

const db = firebase.firestore();
const retroCollection = db.collection(FirestoreCollections.RETRO);

export const DashboardPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  useAnalyticsPage(AnalyticsPage.DASHBOARD);
  const workspaceState = useGetWorkspace();
  useUpdateLastActive(workspaceId);

  const currentUser = useCurrentUser();
  const currentUserId = currentUser?.auth?.uid || "";
  const isWorkspaceOwner = getIsWorkspaceOwner(workspaceState, currentUserId);

  const isSubscriptionLoaded = workspaceState.subscriptionStatus !== undefined;
  const isSubscriptionTrialing = workspaceState.subscriptionStatus === "trialing";
  const isSubscriptionActive = workspaceState.subscriptionStatus === "active";
  const isAccountActive = isSubscriptionTrialing || isSubscriptionActive;

  const isWorkspaceAdmin =
    workspaceState?.users[currentUserId]?.userRole === "owner" || isWorkspaceOwner;

  return (
    <React.Fragment>
      <PageContainer>
        <Navbar isLoggedIn={true} />
        <p className="text-blue mb-2 underline">{workspaceState.name}</p>
        <h1 className="text-blue font-black text-3xl">Dashboard</h1>
        {isWorkspaceOwner && isAccountActive && (
          <UpgradeToProBanner
            workspaceId={workspaceId}
            trialEnd={workspaceState.subscriptionTrialEnd}
          />
        )}
        {isSubscriptionLoaded && !isAccountActive && (
          <BannerTrialEnded
            workspaceId={workspaceId}
            isWorkspaceAdmin={isWorkspaceAdmin}
          />
        )}
        <RetroBoardsOverview
          isWorkspaceAdmin={isWorkspaceAdmin}
          currentUserId={currentUserId}
          workspaceId={workspaceId}
          workspaceOwnerId={workspaceState.ownerId}
          workspaceUsersMap={workspaceState.users}
          retros={workspaceState.retros}
          history={history}
          isActive={isAccountActive}
        />
        <div className="flex flex-col h-full border border-red shadow shadow-red p-4 mt-4">
          <ActionItemsList
            hideForm
            workspaceId={workspaceState.id}
            isOwner={isWorkspaceOwner}
          />
        </div>
      </PageContainer>
      <Footer />
    </React.Fragment>
  );
};

const RetroBoardsOverview: React.FC<{
  currentUserId: User["id"];
  workspaceId: Workspace["id"];
  workspaceOwnerId: Workspace["ownerId"];
  isWorkspaceAdmin: boolean;
  history: RouteComponentProps["history"];
  isActive: boolean;
  retros: Retro[];
  workspaceUsersMap: WorkspaceUsersMap;
}> = ({
  currentUserId,
  history,
  isActive,
  retros,
  workspaceId,
  workspaceOwnerId,
  isWorkspaceAdmin,
  workspaceUsersMap
}) => {
  const createRetro = useCreateRetro();
  const trackEvent = useAnalyticsEvent();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [retroToDelete, setRetroToDelete] = React.useState<Retro | null>(null);

  const handleOpenDeletionModal = (retro: Retro) => {
    setRetroToDelete(retro);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeletionModal = () => {
    setIsDeleteModalOpen(false);
    setRetroToDelete(null);
  };

  const handleDeleteRetro = async () => {
    if (!retroToDelete) {
      return;
    }
    try {
      await retroCollection.doc(retroToDelete.id).delete();
      handleCloseDeletionModal();
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const handleRedirectToRetroPage = (retro: Retro) => {
    trackEvent(AnalyticsEvent.RETRO_OPENED, {
      ...retro,
      location: AnalyticsPage.DASHBOARD,
      retroCount: retros.length,
      openedBy: retro.createdById === workspaceOwnerId ? "workspace-owner" : "member"
    });
    return history.push(`/workspaces/${retro.workspaceId}/retros/${retro.id}`);
  };

  const handleCreateRetro = async () => {
    if (!isActive) {
      return;
    }
    const retro = await createRetro(workspaceId);
    if (retro) {
      trackEvent(AnalyticsEvent.RETRO_CREATED, {
        ...retro,
        location: AnalyticsPage.DASHBOARD,
        retroCount: retros.length,
        createdBy: retro.createdById === workspaceOwnerId ? "workspace-owner" : "member"
      });
      return handleRedirectToRetroPage(retro);
    }
    return;
  };

  return (
    <React.Fragment>
      <DeleteRetroModal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCloseDeletionModal}
        onClickDelete={handleDeleteRetro}
        retro={retroToDelete}
      />
      <div className="flex flex-col h-full border border-red shadow shadow-red p-4 mt-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-red text-xl font-black">Retros</p>
            <p className="text-blue text-xs">
              {!retros.length ? "" : "Your recent retros"}
            </p>
          </div>
          {isActive && (
            <div className="flex items-center">
              <p className="text-blue font-black hidden lg:block">Create Retro</p>
              <button
                disabled={!isActive}
                onClick={handleCreateRetro}
                className="h-10 w-10 bg-blue text-white ml-3 border border-red shadow shadow-red text-2xl hover:bg-pink-1/2 active:transform-1 focus:outline-none"
              >
                +
              </button>
            </div>
          )}
        </div>
        {retros.length !== 0 ? (
          <React.Fragment>
            <div className="flex flex-wrap">
              {retros.slice(0, 2).map((retro) => {
                return (
                  <RetroCard
                    key={retro.id}
                    currentUserId={currentUserId}
                    isWorkspaceAdmin={isWorkspaceAdmin}
                    retro={retro}
                    workspaceUsersMap={workspaceUsersMap}
                    onClick={() => handleRedirectToRetroPage(retro)}
                    onClickDelete={() => handleOpenDeletionModal(retro)}
                  />
                );
              })}
            </div>
            {retros.length >= 2 && (
              <Link
                className="text-right underline text-sm"
                to={`/workspaces/${workspaceId}/retros`}
              >
                <p className="text-blue">See all</p>
              </Link>
            )}
          </React.Fragment>
        ) : (
          <img
            className="mt-4 m-w-7xl self-center"
            src={retroEmptyImage}
            alt="No Retros"
          />
        )}
      </div>
    </React.Fragment>
  );
};

function getIsWorkspaceOwner(workspace: any, userId: string) {
  return workspace?.ownerId === userId;
}
