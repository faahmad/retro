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
        const workspace = await models.workspace.create({
          ...input,
          ownerId: userId
        });

        const user = await models.user.findByPk(userId);
        await user.addWorkspace(workspace.id);

        return workspace;
      } catch (error) {
        throw new ApolloError(error.original.detail);
      }
    }
  }
};
