import { gql } from "apollo-server-express";
import { userSchema } from "./user-schema";

const rootSchema = gql`
  scalar Date
  scalar DateTime

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

export const schema = [rootSchema, userSchema];
