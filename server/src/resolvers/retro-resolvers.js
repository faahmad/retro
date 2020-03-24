import { RetroService } from "../services/retro-service";
import { UserService } from "../services/user-service";
import { WorkspaceService } from "../services/workspace-service";

export const retroResolvers = {
  Query: {
    async retro(parent, { id }, { userId }) {
      const user = await UserService.getUserById(userId);
      const retro = await RetroService.getRetroById(id, user);
      return retro;
    },
    async getRetrosByTeamId(parent, { teamId }) {
      return WorkspaceService.getRetrosByTeam(teamId);
    }
  },
  Mutation: {
    async createRetro(parent, { input }, { userId }) {
      const user = await UserService.getUserById(userId);
      const retro = await RetroService.createRetro(input, user);
      return retro;
    }
  }
};
