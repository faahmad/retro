import models from "../models";

export class WorkspaceService {
  static async createWorkspace(input, userId) {
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
  }
}
