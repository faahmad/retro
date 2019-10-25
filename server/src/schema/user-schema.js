import { gql } from "apollo-server-express";

export const userSchema = gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    createdAt: Float!
    updatedAt: Float!
    googleAccountId: String!
  }
`;
