import { sequelize } from "./src/lib/sequelize";
sequelize.options.logging = false;
import { AuthenticationService } from "./src/services/authentication-service";
jest.mock("./src/services/authentication-service");
const mockedGetUserIdFromIdToken = jest
  .fn()
  .mockImplementation(userId => userId);
AuthenticationService.getUserIdFromIdToken = mockedGetUserIdFromIdToken.bind(
  AuthenticationService
);

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
  jest.resetAllMocks();
});
