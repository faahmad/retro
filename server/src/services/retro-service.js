import models from "../models";

export class RetroService {
  static async createRetro(input, user) {
    if (!user) {
      throw new Error("Retro creation failed: invalid user.");
    }

    const teamsThatUserBelongsTo = await user.getTeams();
    const [team] = teamsThatUserBelongsTo.filter(
      team => String(team.id) === String(input.teamId)
    );
    if (!team) {
      throw new Error(
        "You can't create a retro unless you belong to this team."
      );
    }

    return await models.retro.create({
      name: "",
      teamId: team.id,
      workspaceId: team.workspaceId,
      createdById: user.id
    });
  }
}
