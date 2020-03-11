import { ForbiddenError } from "apollo-server-express";

export const userResolvers = {
  Query: {
    async user(parent, args, { models, userId }) {
      return await models.user.findByPk(userId);
    }
  },
  Mutation: {
    async createUser(parent, { input }, { models, userId }) {
      if (input.id !== userId) {
        throw new ForbiddenError("You can only create yourself.");
      }
      return await models.user.create(input);
    }
  },
  User: {
    async workspace(parent, args, { models }) {
      const user = await models.user.findByPk(parent.id);
      const workspacesThatUserBelongsTo = await user.getWorkspaces();
      if (!workspacesThatUserBelongsTo.length === 0) {
        return null;
      }
      // Only returning the first workspace because we will only
      // allow users to be part of one workspace for now.
      return workspacesThatUserBelongsTo[0];
    },
    async teams(parent, args, { models }) {
      const user = await models.user.findByPk(parent.id);
      const teamsThatUserBelongsTo = await user.getTeams();
      return teamsThatUserBelongsTo;
    }
  }
};
