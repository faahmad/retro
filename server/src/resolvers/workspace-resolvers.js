import { ApolloError } from "apollo-server-express";

export const workspaceResolvers = {
  Query: {
    async workspace(parent, args, { models }) {
      return await models.workspace.findByPk(args.id);
    }
  },
  Mutation: {
    async createWorkspace(parent, { input }, { models, userId }) {
      try {
        return await models.workspace.create({
          ...input,
          ownerId: userId
        });
      } catch (error) {
        throw new ApolloError(error.original.detail);
      }
    }
  }
};
