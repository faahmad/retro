import { factory } from "./test-helpers/factory";
import { executeGraphQLQuery } from "./test-helpers/execute-graphql-query";

describe("user query", () => {
  const userQuery = `
    query {
      user {
        id
        email
        createdAt
        updatedAt
      }
    }
  `;

  describe("when given a valid user id", () => {
    it("should return the current user", async () => {
      const user = await factory.user();

      const queryResult = await executeGraphQLQuery({
        query: userQuery,
        userId: user.id
      });

      expect(queryResult).toMatchObject({
        data: {
          user: {
            id: user.id,
            email: user.email
          }
        }
      });
    });
    it("should return null if the user isn't found", async () => {
      const queryResult = await executeGraphQLQuery({
        query: userQuery,
        userId: "this-id-does-not-exist"
      });

      expect(queryResult).toMatchObject({
        data: {
          user: null
        }
      });
    });
  });
});
