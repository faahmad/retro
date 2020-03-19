import faker from "faker";
import { WorkspaceService } from "../../services/workspace-service";
import { RetroService } from "../../services/retro-service";
import { UserService } from "../../services/user-service";
import models from "../../models";

class Factory {
  async user(options) {
    return models.user.create({
      id: faker.random.uuid(),
      email: faker.internet.email(),
      ...options
    });
  }
  // TODO: Make this the main workspace method for the factory.
  async createWorkspace(options, user) {
    const word = faker.internet.domainWord();
    const name = word.toUpperCase();
    const url = word;
    const allowedEmailDomain = `@${word}.com`;

    const workspace = await WorkspaceService.createWorkspace(
      {
        name,
        url,
        allowedEmailDomain,
        ownerId: user.id,
        ...options
      },
      user
    );

    return workspace;
  }
  async retro(options, workspaceUser) {
    const defaultTeam = await UserService.getDefaultTeamForUser(
      workspaceUser.id
    );
    const retro = await RetroService.createRetro(
      {
        teamId: defaultTeam.id,
        ...options
      },
      workspaceUser
    );
    return retro;
  }
  // NOTE: Don't use this anymore.
  async workspace(options) {
    const word = faker.internet.domainWord();
    const name = word.toUpperCase();
    const url = word;
    const allowedEmailDomain = `@${word}.com`;

    const user = await this.user();

    const workspace = await models.workspace.create({
      name,
      url,
      allowedEmailDomain,
      ownerId: user.id,
      ...options
    });

    user.addWorkspace(workspace.id);

    return workspace;
  }
  async workspaceInvite(options) {
    const workspaceInvite = await models.workspaceInvite.create({
      email: options.email,
      workspaceId: options.workspaceId,
      invitedById: options.invitedById,
      accepted: false
    });

    return workspaceInvite;
  }
}

export const factory = new Factory();
