import { factory } from "./test-helpers/factory";
import { executeGraphQLQuery } from "./test-helpers/execute-graphql-query";

describe("users query", () => {
  const usersQuery = `
    query {
      users {
        id
        email
        createdAt
        updatedAt
      }
    }
  `;

  describe("when valid", () => {
    it("should return an array containing users", async () => {
      const userOne = await factory.user();
      const userTwo = await factory.user();

      const queryResult = await executeGraphQLQuery({ query: usersQuery });

      expect(queryResult.data.users.length).toBe(2);
      expect(queryResult).toMatchObject({
        data: {
          users: [
            {
              id: userOne.id,
              email: userOne.email
            },
            {
              id: userTwo.id,
              email: userTwo.email
            }
          ]
        }
      });
    });
    it("should return an empty array if there are no users", async () => {
      const queryResult = await executeGraphQLQuery({ query: usersQuery });

      expect(queryResult).toMatchObject({
        data: {
          users: []
        }
      });
    });
  });
});
