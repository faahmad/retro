import { GraphQLDate, GraphQLDateTime } from "graphql-iso-date";
import { userResolvers } from "./user-resolvers";

const dateResolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime
};

export const resolvers = [userResolvers, dateResolvers];
