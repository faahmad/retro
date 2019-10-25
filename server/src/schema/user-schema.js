import { gql } from "apollo-server-express";

export const userSchema = gql`
  type User {
    id: ID!
    email: String!
    googleAccountId: String!
    firstName: String!
    lastName: String!
    photoUrl: String
    createdAt: Float!
    updatedAt: Float!
  }

  input CreateUserInput {
    email: String!
    googleAccountId: String!
    firstName: String!
    lastName: String!
  }

  extend type Query {
    users: [User!]
    user(id: ID!): User
  }

  extend type Mutation {
    createUser(input: CreateUserInput): User
  }
`;
