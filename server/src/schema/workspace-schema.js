import { gql } from "apollo-server-express";

export const workspaceSchema = gql`
  type Workspace {
    id: ID!
    name: String!
    iconUrl: String!
    ownerId: String!
    createdAt: Date!
    updatedAt: Date!
  }

  input CreateWorkspaceInput {
    name: String!
  }

  extend type Query {
    workspace(id: ID!): Workspace
  }

  extend type Mutation {
    createWorkspace(input: CreateWorkspaceInput): Workspace
  }
`;
