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
      const workspaceUser = await models.workspaceUser.findOne({
        where: { userId: parent.id }
      });

      if (!workspaceUser) {
        return null;
      }

      return await models.workspace.findByPk(workspaceUser.workspaceId);
    }
  }
};
