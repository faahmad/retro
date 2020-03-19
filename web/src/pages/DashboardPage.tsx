import React from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useParams, RouteComponentProps } from "react-router-dom";
import teamMemberEmptyImage from "../assets/images/team-member-empty-image.svg";
import retroEmptyImage from "../assets/images/retro-empty-image.svg";
import dashboardFooterImage from "../assets/images/dashboard-footer-image.svg";
import { InviteUserToWorkspaceModal } from "../components/InviteUserToWorkspaceModal";
import { LoadingText } from "../components/LoadingText";
import moment from "moment";

const WORKSPACE_QUERY = gql`
  query WorkspaceQuery($id: ID!) {
    workspace(id: $id) {
      id
      name
      url
      teams {
        id
        name
      }
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
`;

export const DashboardPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { workspaceId } = useParams();
  const { data, loading } = useQuery(WORKSPACE_QUERY, {
    variables: { id: workspaceId }
  });

  if (loading) {
    return <LoadingText>Fetching workspace...</LoadingText>;
  }

  const { workspace } = data;
  const defaultTeam = workspace.teams[0];

  return (
    <div>
      <div className="my-16 w-4/5 max-w-6xl m-auto">
        <p className="text-blue mb-2 underline">{workspace.name}</p>
        <h1 className="text-blue font-black text-3xl">Dashboard</h1>
        <RetroBoardsOverview teamId={defaultTeam.id} history={history} />
        <TeamMemberOverview
          workspaceId={workspace.id}
          users={[...workspace.users, ...workspace.invitedUsers]}
        />
      </div>
      <img
        className="w-full"
        src={dashboardFooterImage}
        alt="Dashboard Illustration"
      />
      <footer className="bg-pink text-blue p-2 text-center">
        <p className="text-blue">&copy; 2020, Retro Technology</p>
      </footer>
    </div>
  );
};

const GET_TEAM_RETROS = gql`
  query RetrosByTeam($teamId: ID!) {
    getRetrosByTeamId(teamId: $teamId) {
      id
      name
      teamId
      workspaceId
      createdById
      createdAt
      updatedAt
    }
  }
`;

const CREATE_RETRO_MUTATION = gql`
  mutation CreateRetro($input: CreateRetroInput!) {
    createRetro(input: $input) {
      id
      teamId
      workspaceId
    }
  }
`;

const RetroBoardsOverview: React.FC<{
  teamId: string;
  history: RouteComponentProps["history"];
}> = ({ history, teamId }) => {
  const [retros, setRetros] = React.useState<any[]>([]);
  const { data } = useQuery(GET_TEAM_RETROS, {
    variables: { teamId }
  });

  React.useEffect(() => {
    if (!data) {
      return;
    }
    setRetros(data.getRetrosByTeamId);
  }, [data]);

  const [createRetro] = useMutation(CREATE_RETRO_MUTATION, {
    refetchQueries: ["RetrosByTeam"],
    awaitRefetchQueries: true
  });

  const handleRedirectToRetroPage = (retro: any) => {
    return history.push(
      `/workspaces/${retro.workspaceId}/teams/${retro.teamId}/retros/${retro.id}`
    );
  };

  const handleCreateRetro = async () => {
    const createRetroResponse = await createRetro({
      variables: { input: { teamId } }
    });
    return handleRedirectToRetroPage(createRetroResponse.data.createRetro);
  };

  return (
    <div className="flex flex-col h-full border border-red shadow shadow-red p-4 mt-8">
      <div className="flex justify-between items-center">
        <p className="text-red text-xl font-black">Retros</p>
        <div className="flex items-center">
          <p className="text-blue font-black hidden lg:block">Create Retro</p>
          <button
            onClick={handleCreateRetro}
            className="h-10 w-10 bg-blue text-white ml-3 border border-red shadow shadow-red text-2xl hover:bg-pink-1/2 active:transform-1 focus:outline-none"
          >
            +
          </button>
        </div>
      </div>
      {retros.length !== 0 ? (
        <div className="flex flex-wrap">
          {retros.map(retro => {
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
  users: any[];
}> = ({ workspaceId, users }) => {
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
