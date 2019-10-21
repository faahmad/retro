import { gql } from "apollo-server-express";

export const userSchema = gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
  }
`;
