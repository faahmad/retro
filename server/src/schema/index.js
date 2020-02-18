import { gql } from "apollo-server-express";
import { userSchema } from "./user-schema";
import { workspaceSchema } from "./workspace-schema";
import { teamSchema } from "./team-schema";
import { workspaceInviteSchema } from "./workspace-invite-schema";

const rootSchema = gql`
  scalar Date
  scalar DateTime

  type MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`;

export const schema = [
  rootSchema,
  userSchema,
  workspaceSchema,
  teamSchema,
  workspaceInviteSchema
];
