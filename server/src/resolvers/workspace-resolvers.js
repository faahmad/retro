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

        const team = await models.team.create({
          name: "Default",
          workspaceId: workspace.id
        });

        const user = await models.user.findByPk(userId);
        await user.addWorkspace(workspace.id);
        await user.addTeam(team.id);

        return workspace;
      } catch (error) {
        throw new ApolloError(error.original.detail);
      }
    }
  },
  Workspace: {
    async teams(parent, args, { models }) {
      return models.team.findAll({ where: { workspaceId: parent.id } });
    }
  }
};
