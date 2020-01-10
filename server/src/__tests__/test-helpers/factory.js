import faker from "faker";
import models from "../../models";

class Factory {
  async user(options) {
    return models.user.create({
      id: faker.random.uuid(),
      email: faker.internet.email(),
      ...options
    });
  }
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
}

export const factory = new Factory();
