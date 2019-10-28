/* eslint-disable */
import { sequelize } from "./src/lib/sequelize";
sequelize.options.logging = false;

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
