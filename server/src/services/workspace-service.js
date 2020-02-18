import models from "../models";

export class WorkspaceService {
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

      return workspace;
    } catch (error) {
      const errorMessage = error.original
        ? error.original.detail
        : error.message;
      throw new Error(errorMessage);
    }
  }
}
