import { gql } from "apollo-server-express";

export const workspaceInviteSchema = gql`
  type WorkspaceInvite {
    id: ID!
    email: String!
    workspaceId: ID!
    invitedById: ID!
    accepted: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input InviteUserToWorkspaceInput {
    email: String!
    workspaceId: ID!
  }

  extend type Query {
    getWorkspaceInvitesByWorkspaceId(id: ID!): [WorkspaceInvite]
    getWorkspaceInvitesByEmail(email: String!): [WorkspaceInvite]
  }

  extend type Mutation {
    inviteUserToWorkspace(input: InviteUserToWorkspaceInput!): WorkspaceInvite!
  }
`;
