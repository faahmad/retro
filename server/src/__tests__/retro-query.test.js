import { factory } from "./test-helpers/factory";
import { executeGraphQLQuery } from "./test-helpers/execute-graphql-query";

describe("retro query", () => {
  const retroQuery = `
    query RetroQuery($id: ID!) {
      retro(id: $id) {
        id
        name
        teamId
        workspaceId
      }
    }
  `;

  describe("when valid", () => {
    it("should return the retro", async () => {
      const user = await factory.user();
      await factory.createWorkspace({}, user);
      const retro = await factory.retro({}, user);

      const queryResult = await executeGraphQLQuery({
        query: retroQuery,
        userId: user.id,
        variables: { id: retro.id }
      });

      expect(queryResult).toMatchObject({
        data: {
          retro: {
            id: String(retro.id),
            name: retro.name,
            teamId: String(retro.teamId),
            workspaceId: String(retro.workspaceId)
          }
        }
      });
    });
  });
  describe("when invalid", () => {
    it("should return null if the retro isn't found", async () => {
      const user = await factory.user();
      await factory.createWorkspace({}, user);

      const invalidRetroId = "99";

      const queryResult = await executeGraphQLQuery({
        query: retroQuery,
        userId: user.id,
        variables: { id: invalidRetroId }
      });

      expect(queryResult).toMatchObject({
        data: {
          retro: null
        }
      });
    });
    it("should throw an error if the user does not have access to the retro", async () => {
      const userOne = await factory.user();
      await factory.createWorkspace({}, userOne);
      const retro = await factory.retro({}, userOne);

      const userTwo = await factory.user();
      await factory.createWorkspace({}, userTwo);

      const queryResult = await executeGraphQLQuery({
        query: retroQuery,
        userId: userTwo.id,
        variables: { id: retro.id }
      });

      expect(queryResult.errors.length).toBe(1);
      expect(queryResult.errors[0].message).toBe(
        "Get retro failed: you can not access this retro."
      );
      expect(queryResult.data.retro).toBe(null);
    });
  });
});
