import { sequelize } from "../lib/sequelize";
import models from "../models";
import { addWorkspaceToFirestore } from "./firestore";

export class WorkspaceService {
  static async getUsers(workspaceId) {
    const [users] = await sequelize.query(
      `SELECT u.* FROM "users" u INNER JOIN "workspaceUsers" wu 
      ON u.id = wu."userId" WHERE "workspaceId" = ${workspaceId}`
    );
    return users;
  }
  static async getRetrosByTeam(teamId) {
    return models.retro.findAll({ where: { teamId } });
  }
  static async createWorkspace(input, user) {
    try {
      if (!user) {
        throw new Error("Workspace creation failed: Invalid user.");
      }
      const workspace = await models.workspace.create({
        ...input,
        ownerId: user.id
      });

      const team = await models.team.create({
        name: "Default",
        workspaceId: workspace.id
      });

      await user.addWorkspace(workspace.id);
      await user.addTeam(team.id);

      addWorkspaceToFirestore({
        id: String(workspace.id),
        name: workspace.name,
        url: workspace.url,
        allowedEmailDomain: workspace.allowedEmailDomain,
        owner: {
          id: workspace.ownerId,
          email: user.email
        },
        createdAt: workspace.createdAt,
        updatedAt: workspace.updatedAt
      });

      return workspace;
    } catch (error) {
      const errorMessage = error.original ? error.original.detail : error.message;
      throw new Error(errorMessage);
    }
  }
}
