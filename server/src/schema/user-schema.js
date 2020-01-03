import { gql } from "apollo-server-express";

export const userSchema = gql`
  type User {
    id: ID!
    email: String!
    createdAt: Date!
    updatedAt: Date!
  }

  input CreateUserInput {
    id: ID!
    email: String!
  }

  extend type Query {
    users: [User!]
    user: User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User
  }
`;
