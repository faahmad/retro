import { executeGraphQLQuery } from "./test-helpers/execute-graphql-query";
import faker from "faker";

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
      const mockId = faker.random.uuid();
      const mockEmail = faker.internet.email();

      const variables = { input: { id: mockId, email: mockEmail } };

      const { data } = await executeGraphQLQuery({
        query: createUserMutation,
        userId: mockId,
        variables
      });

      expect(data).toMatchObject({
        createUser: {
          id: mockId,
          email: mockEmail
        }
      });
    });
  });
  describe("when invalid", () => {
    it("should only allow a user to create themselves", async () => {
      const mockId = faker.random.uuid();
      const mockEmail = faker.internet.email();

      const { errors } = await executeGraphQLQuery({
        query: createUserMutation,
        variables: { input: { id: mockId, email: mockEmail } }
      });

      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe("You can only create yourself.");
    });

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
      const variables = { input: { id: null, email: null } };
      const { errors } = await executeGraphQLQuery({
        query: createUserMutation,
        variables
      });

      expect(errors.length).toBe(2);
      expect(errors[0].message).toBe(
        'Variable "$input" got invalid value null at "input.id"; Expected non-nullable type ID! not to be null.'
      );
      expect(errors[1].message).toBe(
        'Variable "$input" got invalid value null at "input.email"; Expected non-nullable type String! not to be null.'
      );
    });
  });
});
