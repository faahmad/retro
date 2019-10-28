/* eslint-disable */
import { factory } from "./test-helpers/factory";
import { executeGraphQLQuery } from "./test-helpers/execute-graphql-query";

describe("user query", () => {
  const userQuery = `
    query($id: ID!) {
      user(id: $id) {
        id
        email
        googleAccountId
        firstName
        lastName
        createdAt
        updatedAt
      }
    }
  `;

  describe("when valid", () => {
    it("should return the user that matches the id", async () => {
      const user = await factory.user();
      const variables = { id: user.id };

      const queryResult = await executeGraphQLQuery(userQuery, variables);

      expect(queryResult).toMatchObject({
        data: {
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        }
      });
    });
    it("should return null if user isn't found", async () => {
      const variables = { id: 1 };

      const queryResult = await executeGraphQLQuery(userQuery, variables);

      expect(queryResult).toMatchObject({
        data: {
          user: null
        }
      });
    });
  });
  describe("when invalid", () => {
    it("should return an error when id is not provided", async () => {
      const queryResult = await executeGraphQLQuery(userQuery);

      expect(queryResult).toMatchObject({
        error: {
          message: null
        }
      });
    });
  });
});
