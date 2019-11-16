import { GraphQLDate, GraphQLDateTime } from "graphql-iso-date";
import { userResolvers } from "./user-resolvers";
import { workspaceResolvers } from "./workspace-resolvers";

const dateResolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime
};

export const resolvers = [dateResolvers, userResolvers, workspaceResolvers];
