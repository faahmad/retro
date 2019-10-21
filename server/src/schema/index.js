import { gql } from "apollo-server-express";
import { userSchema } from "./user-schema";

const linkSchema = gql`
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

export const schema = [linkSchema, userSchema];
