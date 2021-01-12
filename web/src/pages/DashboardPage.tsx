import React from "react";
import { RouteComponentProps } from "react-router-dom";
import teamMemberEmptyImage from "../assets/images/team-member-empty-image.svg";
import retroEmptyImage from "../assets/images/retro-empty-image.svg";
import { InviteUserToWorkspaceModal } from "../components/InviteUserToWorkspaceModal";
import { LoadingText } from "../components/LoadingText";
import moment from "moment";
import { Footer } from "../components/Footer";
import { PageContainer } from "../components/PageContainer";
import { UpgradeToProBanner } from "../components/UpgradeToProBanner";
import { useCurrentUser } from "../hooks/use-current-user";
import analytics from "analytics.js";
import { useWorkspaceState } from "../hooks/use-workspace-state";
import { WorkspaceUser } from "../types/workspace-user";
import { WorkspaceInvite } from "../types/workspace-invite";

export const DashboardPage: React.FC<RouteComponentProps> = ({ history }) => {
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
        <RetroBoardsOverview history={history} isActive={workspaceState.isActive} />
        <TeamMemberOverview
          workspaceName={workspaceState.name}
          workspaceId={workspaceState.id}
          users={workspaceState.users}
          invitedUsers={workspaceState.invitedUsers}
          isActive={workspaceState.isActive}
        />
      </PageContainer>
      <Footer />
    </div>
  );
};

const RetroBoardsOverview: React.FC<{
  history: RouteComponentProps["history"];
  isActive: boolean;
}> = ({ history, isActive }) => {
  const [retros] = React.useState<any[]>([]);

  const handleRedirectToRetroPage = (retro: any) => {
    analytics.track("Retro Opened", { ...retro });
    return history.push(
      `/workspaces/${retro.workspaceId}/teams/${retro.teamId}/retros/${retro.id}`
    );
  };

  const handleCreateRetro = async () => {
    if (!isActive) {
      return;
    }
    // const { data } = await createRetroMutation({
    //   variables: { input: { teamId } }
    // });
    // createRetroBoardInFirebase(data.createRetro);
    // analytics.track("Retro Created", { ...data.createRetro });
    // return handleRedirectToRetroPage(data.createRetro);
  };

  return (
    <div className="flex flex-col h-full border border-red shadow shadow-red p-4 mt-8">
      <div className="flex justify-between items-center">
        <p className="text-red text-xl font-black">Retros</p>
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
        <div className="flex flex-wrap">
          {retros.map((retro) => {
            return (
              <div
                key={retro.id}
                onClick={() => handleRedirectToRetroPage(retro)}
                className="flex flex-col lg:flex-row text-center lg:text-left items-center mx-auto lg:mx-4 my-4 w-64"
              >
                <div className="flex flex-col flex-shrink ml-1 bg-pink p-4 cursor-pointer hover:bg-pink-1/2 hover:shadow-blue">
                  <p className="text-xs text-blue">#{retro.id}</p>
                  <p className="text-blue text-sm font-light">
                    {retro.name || moment(retro.createdAt).format("LLLL")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <img className="mt-4" src={retroEmptyImage} alt="No Retros" />
      )}
    </div>
  );
};

const TeamMemberOverview: React.FC<{
  workspaceId: string;
  workspaceName: string;
  users: WorkspaceUser[];
  invitedUsers: WorkspaceInvite[];
  isActive: boolean;
}> = ({ workspaceId, workspaceName, users, isActive, invitedUsers }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleToggleModal = async () => {
    await setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  return (
    <React.Fragment>
      <InviteUserToWorkspaceModal
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        isOpen={isModalOpen}
        onRequestClose={handleToggleModal}
        onClick={handleToggleModal}
      />
      <div className="flex flex-col h-full border border-red shadow shadow-red p-4 mt-8">
        <div className="flex justify-between items-center">
          <p className="text-red text-xl font-black">Team Members</p>
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
          <img className="mt-4" src={teamMemberEmptyImage} alt="No Team Members" />
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
    <div className="flex flex-col lg:flex-row text-center lg:text-left items-center mx-auto lg:mx-4 my-4 w-64">
      <img
        alt="User Avatar"
        src={userPhotoURL}
        className={`flex h-12 w-12 rounded-full text-white items-center justify-center border border-red text-xl flex-shrink-0 ${"bg-blue text-white"}`}
      />
      <div className="flex flex-col flex-shrink ml-2">
        <p className="text-blue text-xs font-black">
          {userDisplayName} <span className="uppercase text-pink">{userRole}</span>
        </p>
        <p className="text-blue text-sm font-light">{userEmail}</p>
      </div>
    </div>
  );
}

function WorkspaceInviteItem({ email }: WorkspaceInvite) {
  return (
    <div className="flex flex-col lg:flex-row text-center lg:text-left items-center mx-auto lg:mx-4 my-4 w-64">
      <div
        className={`flex h-12 w-12 rounded-full text-white items-center justify-center border border-red text-xl flex-shrink-0 ${"bg-blue text-white"}`}
      >
        {email[0]}
      </div>
      <div className="flex flex-col flex-shrink ml-2">
        <p className="text-blue text-xs font-black">invited</p>
        <p className="text-blue text-sm font-light">{email}</p>
      </div>
    </div>
  );
}

function getIsWorkspaceOwner(workspace: any, userId: string) {
  return workspace?.ownerId === userId;
}
