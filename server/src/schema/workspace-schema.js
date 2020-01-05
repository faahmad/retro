import { gql } from "apollo-server-express";

export const workspaceSchema = gql`
  type Workspace {
    id: ID!
    name: String!
    url: String
    allowedEmailDomains: [String]
    ownerId: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateWorkspaceInput {
    name: String!
    url: String
    allowedEmailDomains: [String]
  }

  extend type Query {
    workspace(id: ID!): Workspace
  }

  extend type Mutation {
    createWorkspace(input: CreateWorkspaceInput!): Workspace
  }
`;
