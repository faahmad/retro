import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Redirect } from "react-router-dom";
import teamMemberEmptyImage from "../assets/images/team-member-empty-image.svg";
import dashboardFooterImage from "../assets/images/dashboard-footer-image.svg";

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
    window.location.replace("/");
  }

  if (!user.workspace) {
    return <Redirect to="/workspace/create" />;
  }

  return (
    <div>
      <div className="my-16 w-4/5 max-w-6xl m-auto">
        <p className="text-blue mb-2 underline">{user.workspace.name}</p>
        <h1 className="text-blue font-black text-3xl">Dashboard</h1>

        <TeamMemberOverview />
      </div>
      <img src={dashboardFooterImage} alt="Dashboard Illustration" />
      <footer className="bg-pink text-blue p-2 text-center">
        <p className="text-blue">&copy; 2020, Retro Technology</p>
      </footer>
    </div>
  );
};

const TeamMemberOverview: React.FC = () => {
  return (
    <div className="flex flex-col h-full border border-red shadow shadow-red p-4 mt-8">
      <div className="flex justify-between items-center">
        <p className="text-red text-xl font-black">Team Members</p>
        <div className="flex items-center">
          <p className="text-blue font-black">Invite Member</p>
          <button className="h-10 w-10 bg-blue text-white ml-3 border border-red shadow shadow-red text-2xl hover:bg-pink-1/2 active:transform-1 focus:outline-none">
            +
          </button>
        </div>
      </div>
      <img className="mt-4" src={teamMemberEmptyImage} alt="No Team Members" />
    </div>
  );
};
