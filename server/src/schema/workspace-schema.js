import { gql } from "apollo-server-express";

export const workspaceSchema = gql`
  type Workspace {
    id: ID!
    name: String!
    url: String
    allowedEmailDomain: String
    ownerId: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    teams: [Team]
    users: [User]
    invitedUsers: [WorkspaceInvite]
  }

  input CreateWorkspaceInput {
    name: String!
    url: String
    allowedEmailDomain: String
  }

  extend type Query {
    workspace(id: ID!): Workspace
    getWorkspacesThatUserIsInvitedTo: [Workspace]
    getWorkspacesByAllowedEmailDomain(allowedEmailDomain: String!): [Workspace]
  }

  extend type Mutation {
    createWorkspace(input: CreateWorkspaceInput!): Workspace
    joinWorkspace(workspaceId: ID!): MutationResponse!
  }
`;
