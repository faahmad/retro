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

    return models.workspace.create({
      name,
      url,
      allowedEmailDomain,
      ownerId: user.id,
      ...options
    });
  }
}

export const factory = new Factory();
