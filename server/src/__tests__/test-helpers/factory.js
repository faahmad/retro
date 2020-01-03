import faker from "faker";
import models from "../../models";

export const factory = {
  user: options => {
    return models.user.create({
      id: faker.random.uuid(),
      email: faker.internet.email(),
      ...options
    });
  }
};
