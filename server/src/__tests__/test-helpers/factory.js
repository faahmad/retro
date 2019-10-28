import faker from "faker";
import models from "../../models";

class Factory {
  constructor(models) {
    this.models = models;
  }

  user(options) {
    return this.models.User.create({
      email: faker.internet.email(),
      googleAccountId: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      ...options
    });
  }
}

export const factory = new Factory(models);
