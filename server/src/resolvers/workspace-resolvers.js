import { ApolloError, ForbiddenError } from "apollo-server-express";
import { sequelize } from "../lib/sequelize";
import { WorkspaceService } from "../services/workspace-service";

export const workspaceResolvers = {
  Query: {
    async workspace(parent, args, { models }) {
      return await models.workspace.findByPk(args.id);
    },
    async getWorkspacesThatUserIsInvitedTo(parent, args, { userId, models }) {
      const user = await models.user.findByPk(userId);
      const [results] = await sequelize.query(
        `SELECT w.id, w.name, w.url from "workspaces" w LEFT JOIN "workspaceInvites" wi ON w.id = wi."workspaceId" WHERE email = '${user.email}';`
      );
      return results;
    }
  },
  Mutation: {
    async createWorkspace(parent, { input }, { userId }) {
      try {
        const workspace = await WorkspaceService.createWorkspace(input, userId);
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
    },
    async joinWorkspace(parent, { workspaceId }, { models, userId }) {
      try {
        const user = await models.user.findByPk(userId);
        const workspace = await models.workspace.findByPk(workspaceId);

        if (!workspace) {
          throw new ApolloError("Invalid workspace id");
        }

        const workspaceInvite = await models.workspaceInvite.findOne({
          where: { workspaceId: workspace.id, email: user.email }
        });

        if (
          !workspaceInvite &&
          !user.email.endsWith(workspace.allowedEmailDomain)
        ) {
          throw new ForbiddenError(
            "User is not allowed to join this workspace."
          );
        }

        const defaultTeam = await models.team.findOne({
          where: { workspaceId: workspace.id }
        });

        if (workspaceInvite) {
          await workspaceInvite.update({ accepted: true });
        }
        await user.addWorkspace(workspace.id);
        await user.addTeam(defaultTeam.id);

        return {
          code: 200,
          success: true,
          message: "Successfully added user to workspace."
        };
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
