import { gql } from "apollo-server-express";

export const retroSchema = gql`
  type Retro {
    id: ID!
    name: String!
    teamId: ID!
    workspaceId: ID!
    createdById: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateRetroInput {
    teamId: ID!
  }

  extend type Query {
    getRetrosByTeamId(teamId: ID!): [Retro]
  }

  extend type Mutation {
    createRetro(input: CreateRetroInput!): Retro
  }
`;
