/* eslint-disable */
import { sequelize } from "./src/lib/sequelize";

beforeEach(async () => {
  await sequelize.sync({ force: true });
});
