import models from "../models";
import { UserService } from "./user-service";

export class RetroService {
  static async getRetroById(id, user) {
    if (!user) {
      throw new Error("Get retro failed: invalid user.");
    }
    const retro = await models.retro.findByPk(id);
    const defaultTeam = await UserService.getDefaultTeamForUser(user.id);
    if (retro.teamId !== defaultTeam.id) {
      throw new Error("Get retro failed: you can not access this retro.");
    }
    return retro;
  }
  static async createRetro(input, user) {
    if (!user) {
      throw new Error("Retro creation failed: invalid user.");
    }
    const defaultTeam = await UserService.getDefaultTeamForUser(user.id);
    if (String(input.teamId) !== String(defaultTeam.id)) {
      throw new Error(
        "You can't create a retro unless you belong to this team."
      );
    }
    return await models.retro.create({
      name: "",
      teamId: defaultTeam.id,
      workspaceId: defaultTeam.workspaceId,
      createdById: user.id
    });
  }
}
