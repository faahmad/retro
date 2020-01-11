import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { LoadingPage } from "./LoadingPage";
import { Redirect } from "react-router-dom";

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
    return <LoadingPage />;
  }
  const { user } = userQueryResponse.data;

  if (!user) {
    window.location.replace("/");
  }

  if (!user.workspace) {
    return <Redirect to="/workspace/create" />;
  }

  return (
    <div className="mt-16 w-4/5 max-w-6xl m-auto">
      <p className="text-blue mb-2 underline">{user.workspace.name}</p>
      <h1 className="text-blue font-black text-3xl">Dashboard</h1>
      <p className="text-blue mt-2">hello world.</p>
    </div>
  );
};
