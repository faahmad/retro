import { gql } from "apollo-server-express";

export const userSchema = gql`
  type User {
    id: ID!
    email: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    workspace: Workspace
    teams: [Team]
  }

  input CreateUserInput {
    id: ID!
    email: String!
  }

  extend type Query {
    user: User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User
  }
`;
