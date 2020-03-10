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
    async teams(parent, args, { models }) {
      const user = await models.user.findByPk(parent.id);
      const teamsThatUserBelongsTo = await user.getTeams();
      return teamsThatUserBelongsTo;
    }
  }
};
