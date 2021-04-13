import React from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import teamMemberEmptyImage from "../assets/images/team-member-empty-image.svg";
import retroEmptyImage from "../assets/images/retro-empty-image.svg";
import { InviteUserToWorkspaceModal } from "../components/InviteUserToWorkspaceModal";
import { LoadingText } from "../components/LoadingText";
import { Footer } from "../components/Footer";
import { PageContainer } from "../components/PageContainer";
import { UpgradeToProBanner } from "../components/UpgradeToProBanner";
import { useCurrentUser } from "../hooks/use-current-user";
import { useWorkspaceState } from "../hooks/use-workspace-state";
import { WorkspaceUser } from "../types/workspace-user";
import { WorkspaceInvite, WorkspaceInviteStatus } from "../types/workspace-invite";
import { Retro } from "../types/retro";
import { Workspace } from "../types/workspace";
import { useCreateRetro } from "../hooks/use-create-retro";
import { RetroCard } from "../components/RetroCard";
import { useAnalyticsPage, AnalyticsPage } from "../hooks/use-analytics-page";
import { useAnalyticsEvent, AnalyticsEvent } from "../hooks/use-analytics-event";

export const DashboardPage: React.FC<RouteComponentProps> = ({ history }) => {
  useAnalyticsPage(AnalyticsPage.DASHBOARD);
  const currentUser = useCurrentUser();
  const workspaceState = useWorkspaceState();

  if (workspaceState.status === "loading") {
    return <LoadingText>Fetching workspace...</LoadingText>;
  }

  if (workspaceState.status === "error") {
    return <LoadingText>Uh oh...something went wrong.</LoadingText>;
  }

  const userId = currentUser?.auth?.uid;
  const isWorkspaceOwner = getIsWorkspaceOwner(workspaceState, userId || "");
  const isInTrialMode = workspaceState.subscriptionStatus === "trialing";

  return (
    <div>
      <PageContainer>
        <p className="text-blue mb-2 underline">{workspaceState.name}</p>
        <h1 className="text-blue font-black text-3xl">Dashboard</h1>
        {isInTrialMode && isWorkspaceOwner && (
          <UpgradeToProBanner
            workspaceId={workspaceState.id}
            trialEnd={workspaceState.subscriptionTrialEnd}
          />
        )}
        <RetroBoardsOverview
          workspaceId={workspaceState.id}
          workspaceOwnerId={workspaceState.ownerId}
          retros={workspaceState.retros}
          history={history}
          isActive={workspaceState.isActive}
        />
        <TeamMemberOverview
          workspaceName={workspaceState.name}
          workspaceId={workspaceState.id}
          workspaceOwnerId={workspaceState.ownerId}
          workspaceURL={workspaceState.url}
          users={Object.values(workspaceState.users)}
          invitedUsers={workspaceState.invitedUsers}
          isActive={workspaceState.isActive}
        />
      </PageContainer>
      <Footer />
    </div>
  );
};

const RetroBoardsOverview: React.FC<{
  workspaceId: Workspace["id"];
  workspaceOwnerId: Workspace["ownerId"];
  history: RouteComponentProps["history"];
  isActive: boolean;
  retros: Retro[];
}> = ({ history, isActive, retros, workspaceId, workspaceOwnerId }) => {
  const createRetro = useCreateRetro();
  const trackEvent = useAnalyticsEvent();

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
    <div className="flex flex-col h-full border border-red shadow shadow-red p-4 mt-8">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-red text-xl font-black">Retros</p>
          <p className="text-blue text-xs">
            {!retros.length ? "" : "Your recent retros"}
          </p>
        </div>
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
      </div>
      {retros.length !== 0 ? (
        <React.Fragment>
          <div className="flex flex-wrap">
            {retros.slice(0, 2).map((retro) => {
              return (
                <RetroCard
                  key={retro.id}
                  retro={retro}
                  onClick={() => handleRedirectToRetroPage(retro)}
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
        <img className="mt-4 m-w-7xl self-center" src={retroEmptyImage} alt="No Retros" />
      )}
    </div>
  );
};

const TeamMemberOverview: React.FC<{
  workspaceId: string;
  workspaceName: string;
  workspaceOwnerId: string;
  users: WorkspaceUser[];
  invitedUsers: WorkspaceInvite[];
  isActive: boolean;
  workspaceURL: string;
}> = ({
  workspaceId,
  workspaceName,
  users,
  isActive,
  invitedUsers,
  workspaceOwnerId,
  workspaceURL
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleToggleModal = async () => {
    await setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const userCount = users.length;

  return (
    <React.Fragment>
      <InviteUserToWorkspaceModal
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        workspaceOwnerId={workspaceOwnerId}
        workspaceURL={workspaceURL}
        userCount={users.length}
        invitedUserCount={invitedUsers.length}
        isOpen={isModalOpen}
        onRequestClose={handleToggleModal}
        onClick={handleToggleModal}
      />
      <div className="flex flex-col h-full border border-red shadow shadow-red p-4 mt-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-red text-xl font-black">Team Members</p>
            <p className="text-blue text-xs">
              {userCount > 1 ? `${userCount}/10 seats used` : ""}
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-blue font-black hidden lg:block">Invite Member</p>
            <button
              disabled={!isActive}
              onClick={handleToggleModal}
              className="h-10 w-10 bg-blue text-white ml-3 border border-red shadow shadow-red text-2xl hover:bg-pink-1/2 active:transform-1 focus:outline-none"
            >
              +
            </button>
          </div>
        </div>
        {/* 
          If users.length === 1, this means that you're the only person in the workspace. 
          In this case, we want to display the No Team Members illustration 
        */}
        {users.length !== 1 || invitedUsers.length !== 0 ? (
          <div className="flex flex-wrap">
            {users.map((user) => {
              return <WorkspaceUserItem key={user.userId} {...user} />;
            })}
            {invitedUsers.map((invitedUser) => (
              <WorkspaceInviteItem key={invitedUser.id} {...invitedUser} />
            ))}
          </div>
        ) : (
          <img
            className="mt-4 m-w-7xl self-center"
            src={teamMemberEmptyImage}
            alt="No Team Members"
          />
        )}
      </div>
    </React.Fragment>
  );
};

function WorkspaceUserItem({
  userPhotoURL,
  userDisplayName,
  userRole,
  userEmail
}: WorkspaceUser) {
  return (
    <div className="flex flex-col lg:flex-row text-center lg:text-left items-center mx-auto lg:mx-8 my-4 w-64">
      {userPhotoURL ? (
        <img
          alt="User Avatar"
          src={userPhotoURL}
          className={`flex h-12 w-12 rounded-full text-white items-center justify-center border border-red text-xl flex-shrink-0 ${"bg-blue text-white"}`}
        />
      ) : (
        <PlaceholderAvatar char={userEmail[0]} />
      )}

      <div className="flex flex-col flex-shrink ml-2">
        <p className="text-blue text-xs font-black">
          {userDisplayName} <span className="uppercase text-pink">{userRole}</span>
        </p>
        <p className="text-blue text-sm font-light">{userEmail}</p>
      </div>
    </div>
  );
}

function WorkspaceInviteItem({ email, status }: WorkspaceInvite) {
  const statusMap: any = {
    [WorkspaceInviteStatus.SENDING]: "inviting...",
    [WorkspaceInviteStatus.SENT]: "invited",
    [WorkspaceInviteStatus.FAILED]: "failed"
  };

  return (
    <div className="flex flex-col lg:flex-row text-center lg:text-left items-center mx-auto lg:mx-4 my-4 w-64">
      <PlaceholderAvatar char={email[0]} />
      <div className="flex flex-col flex-shrink ml-2">
        <p className="text-blue text-xs font-black">{statusMap[status]}</p>
        <p className="text-blue text-sm font-light">{email}</p>
      </div>
    </div>
  );
}

function PlaceholderAvatar({ char }: { char: string }) {
  return (
    <div
      className={`flex h-12 w-12 rounded-full text-white items-center justify-center border border-red text-xl flex-shrink-0 ${"bg-blue text-white"}`}
    >
      {char}
    </div>
  );
}

function getIsWorkspaceOwner(workspace: any, userId: string) {
  return workspace?.ownerId === userId;
}
