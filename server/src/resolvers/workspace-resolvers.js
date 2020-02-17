import { ApolloError, ForbiddenError } from "apollo-server-express";
import { sequelize } from "../lib/sequelize";

export const workspaceResolvers = {
  Query: {
    async workspace(parent, args, { models }) {
      return await models.workspace.findByPk(args.id);
    },
    async getWorkspacesThatUserIsInvitedTo(parent, args, { userId, models }) {
      const user = await models.user.findByPk(userId);
      const [results] = await sequelize.query(
        `SELECT * from "workspaces" w LEFT JOIN "workspaceInvites" wi ON w.id = wi."workspaceId" WHERE email = '${user.email}';`
      );
      return results;
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
    },
    async inviteUserToWorkspace(parent, { input }, { models, userId }) {
      try {
        const user = await models.user.findByPk(userId);
        const workspaces = await user.getWorkspaces({
          where: { id: input.workspaceId }
        });
        if (workspaces.length === 0) {
          throw new ForbiddenError(
            "You can't invite a user to a workspace that you're not a member of."
          );
        }

        // TODO (created 1/17/2020):
        // Use a database constraint on the email and workspaceId
        // columns, instead of checking uniqueness manually.
        const workspaceInvites = await models.workspaceInvite.findAll({
          where: { email: input.email, workspaceId: input.workspaceId }
        });
        if (workspaceInvites.length !== 0) {
          throw new ForbiddenError(
            "User has already been invited to this workspace."
          );
        }

        const workspaceInvite = await models.workspaceInvite.create({
          email: input.email,
          workspaceId: input.workspaceId,
          invitedById: userId,
          accepted: false
        });

        return workspaceInvite;
      } catch (error) {
        throw new ApolloError(error.message);
      }
    }
  },
  Workspace: {
    async teams(parent, args, { models }) {
      return models.team.findAll({ where: { workspaceId: parent.id } });
    }
  }
};
