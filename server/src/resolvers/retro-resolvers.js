import { RetroService } from "../services/retro-service";
import { UserService } from "../services/user-service";

export const retroResolvers = {
  Query: {},
  Mutation: {
    async createRetro(parent, { input }, { userId }) {
      const user = await UserService.getUserById(userId);
      const retro = await RetroService.createRetro(input, user);
      return retro;
    }
  }
};
