import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Redirect } from "react-router-dom";
import teamMemberEmptyImage from "../assets/images/team-member-empty-image.svg";
import dashboardFooterImage from "../assets/images/dashboard-footer-image.svg";
import { ROUTES } from "../constants/routes";
import { InviteUserToWorkspaceModal } from "../components/InviteUserToWorkspaceModal";

const USER_QUERY = gql`
  query UserQuery {
    user {
      id
      email
      createdAt
      updatedAt
      workspace {
        id
        name
        url
        users {
          __typename
          id
          email
          createdAt
        }
        invitedUsers {
          __typename
          id
          email
          createdAt
          accepted
        }
      }
    }
  }
`;

export const DashboardPage: React.FC = () => {
  const userQueryResponse = useQuery(USER_QUERY);
  if (userQueryResponse.loading) {
    return <div>Loading...</div>;
  }
  const { user } = userQueryResponse.data;

  if (!user) {
    // If the page has loaded before we fetch the user,
    // force a refresh.
    window.location.replace(ROUTES.AUTHENTICATED.DASHBOARD_PAGE);
  }

  if (!user.workspace) {
    return <Redirect to={ROUTES.AUTHENTICATED.ONBOARDING_PAGE} />;
  }

  const usersInWorkspace = user.workspace.users;
  const usersInvitedToWorkspace = user.workspace.invitedUsers;

  console.log("render");
  console.log(user);

  return (
    <div>
      <div className="my-16 w-4/5 max-w-6xl m-auto">
        <p className="text-blue mb-2 underline">{user.workspace.name}</p>
        <h1 className="text-blue font-black text-3xl">Dashboard</h1>
        <TeamMemberOverview
          workspaceId={user.workspace.id}
          users={[...usersInWorkspace, ...usersInvitedToWorkspace]}
        />
      </div>
      <img src={dashboardFooterImage} alt="Dashboard Illustration" />
      <footer className="bg-pink text-blue p-2 text-center">
        <p className="text-blue">&copy; 2020, Retro Technology</p>
      </footer>
    </div>
  );
};

const TeamMemberOverview: React.FC<{
  workspaceId: string;
  users: any[];
}> = ({ workspaceId, users }) => {
  console.log("users", users);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleToggleModal = async () => {
    await setIsModalOpen(prevIsModalOpen => !prevIsModalOpen);
  };

  return (
    <React.Fragment>
      <InviteUserToWorkspaceModal
        workspaceId={workspaceId}
        isOpen={isModalOpen}
        onRequestClose={handleToggleModal}
        onClick={handleToggleModal}
      />
      <div className="flex flex-col h-full border border-red shadow shadow-red p-4 mt-8">
        <div className="flex justify-between items-center">
          <p className="text-red text-xl font-black">Team Members</p>
          <div className="flex items-center">
            <p className="text-blue font-black hidden lg:block">
              Invite Member
            </p>
            <button
              onClick={handleToggleModal}
              className="h-10 w-10 bg-blue text-white ml-3 border border-red shadow shadow-red text-2xl hover:bg-pink-1/2 active:transform-1 focus:outline-none"
            >
              +
            </button>
          </div>
        </div>
        {users.length !== 0 ? (
          <div className="flex flex-wrap">
            {users.map(u => {
              const isInvitedUser = u.__typename === "WorkspaceInvite";
              return (
                <div
                  key={u.id}
                  className="flex flex-col lg:flex-row text-center lg:text-left items-center mx-auto lg:mx-4 my-4 w-64"
                >
                  <div
                    className={`flex h-12 w-12 rounded-full text-white items-center justify-center border border-red text-xl flex-shrink-0 ${
                      isInvitedUser
                        ? "bg-pink-1/2 text-blue"
                        : "bg-blue text-white"
                    }`}
                  >
                    {u.email[0]}
                  </div>
                  <div className="flex flex-col flex-shrink ml-1">
                    <p className="text-blue text-sm font-light">{u.email}</p>
                    <p className="uppercase text-pink text-xs font-black">
                      {isInvitedUser ? "invited" : "member"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <img
            className="mt-4"
            src={teamMemberEmptyImage}
            alt="No Team Members"
          />
        )}
      </div>
    </React.Fragment>
  );
};
