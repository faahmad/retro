import { executeGraphQLQuery } from "./test-helpers/execute-graphql-query";

describe("createUser mutation", () => {
  const createUserMutation = `
    mutation($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        email
        createdAt
        updatedAt
      }
    }
  `;

  describe("when given valid input", () => {
    it("should create a user", async () => {
      const mockEmail = "faraz+test@retro.app";
      const variables = { input: { email: mockEmail } };

      const { data } = await executeGraphQLQuery({
        query: createUserMutation,
        variables
      });

      expect(data).toMatchObject({
        createUser: {
          id: "1",
          email: mockEmail
        }
      });
    });
  });
  describe("when invalid", () => {
    it("should return an error when no input is given", async () => {
      const { errors } = await executeGraphQLQuery({
        query: createUserMutation
      });

      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe(
        'Variable "$input" of required type "CreateUserInput!" was not provided.'
      );
    });

    it("should return an error when an email is not given as a variable", async () => {
      const variables = { input: { email: null } };
      const { errors } = await executeGraphQLQuery({
        query: createUserMutation,
        variables
      });

      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe(
        'Variable "$input" got invalid value null at "input.email"; Expected non-nullable type String! not to be null.'
      );
    });
  });
});
