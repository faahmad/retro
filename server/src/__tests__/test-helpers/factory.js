import faker from "faker";
import models from "../../models";

export const factory = {
  user: options => {
    return models.user.create({
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      ...options
    });
  }
};
