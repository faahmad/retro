import { executeGraphQLQuery } from "./test-helpers/execute-graphql-query";
import { factory } from "./test-helpers/factory";
import faker from "faker";

describe("createWorkspace mutation", () => {
  const createWorkspaceMutation = `
    mutation CreateWorkspace($input: CreateWorkspaceInput!) {
      createWorkspace(input: $input) {
        id
        name
        url
        allowedEmailDomains
        owner
        createdAt
        updatedAt
      }
    }
  `;

  describe("when given valid input", () => {
    let user;
    beforeEach(async () => {
      user = await factory.user();
    });
    it("should create a workspace", async () => {
      const name = faker.company.companyName();
      const url = faker.internet.url();
      const allowedEmailDomains = [faker.internet.domainName()];

      const { data } = await executeGraphQLQuery({
        query: createWorkspaceMutation,
        userId: user.id,
        variables: {
          input: {
            name,
            url,
            allowedEmailDomains
          }
        }
      });

      expect(data).toMatchObject({
        createWorkspace: {
          name,
          url,
          allowedEmailDomains
        }
      });
    });
  });
  describe("when invalid", () => {
    xit("should only allow a user to create themselves", async () => {
      const mockId = faker.random.uuid();
      const mockEmail = faker.internet.email();

      const { errors } = await executeGraphQLQuery({
        query: createUserMutation,
        variables: { input: { id: mockId, email: mockEmail } }
      });

      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe("You can only create yourself.");
    });

    xit("should return an error when no input is given", async () => {
      const { errors } = await executeGraphQLQuery({
        query: createUserMutation
      });

      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe(
        'Variable "$input" of required type "CreateUserInput!" was not provided.'
      );
    });

    xit("should return an error when an email is not given as a variable", async () => {
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
