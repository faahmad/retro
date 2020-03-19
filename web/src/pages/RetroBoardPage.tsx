import * as React from "react";
import { RouteComponentProps, useParams } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

const RETRO_QUERY = gql`
  query RetroQuery($id: ID!) {
    retro(id: $id) {
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

export const RetroBoardPage: React.FC<RouteComponentProps> = () => {
  const params = useParams<{ retroId: string }>();
  const { data, loading, error } = useQuery(RETRO_QUERY, {
    variables: { id: params.retroId }
  });

  if (loading) {
    return (
      <PageContainer>
        <p className="text-blue">Fetching retro...</p>
      </PageContainer>
    );
  }

  if (!data || !data.retro) {
    return (
      <PageContainer>
        <p className="text-red">Couldn't fetch the retro.</p>
        {error && <p className="text-red">{error.message}</p>}
      </PageContainer>
    );
  }

  const { retro } = data;

  return (
    <PageContainer>
      <h1 className="text-blue font-black text-3xl">
        Retro Board - {retro.id}
      </h1>
      <p className="text-blue mt-2">
        <pre>
          <code>{JSON.stringify(retro, null, 2)}</code>
        </pre>
      </p>
    </PageContainer>
  );
};

const PageContainer: React.FC = ({ children }) => {
  return <div className="my-16 w-4/5 max-w-6xl m-auto">{children}</div>;
};
