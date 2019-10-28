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

  describe("when given a valid user id", () => {
    it("should return the user with the matching id", async () => {
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
    it("should return null if the user isn't found", async () => {
      const variables = { id: 1 };

      const queryResult = await executeGraphQLQuery(userQuery, variables);

      expect(queryResult).toMatchObject({
        data: {
          user: null
        }
      });
    });
  });
  describe("when not given a user id", () => {
    it("should return an error", async () => {
      const queryResult = await executeGraphQLQuery(userQuery);

      expect(queryResult.errors.length).toBe(1);
      expect(queryResult.errors[0].message).toBe(
        'Variable "$id" of required type "ID!" was not provided.'
      );
    });
  });
});
