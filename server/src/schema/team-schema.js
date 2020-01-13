import { gql } from "apollo-server-express";

export const teamSchema = gql`
  type Team {
    id: ID!
    name: String!
    workspaceId: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    url: String
  }
`;
