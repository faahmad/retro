import { executeGraphQLQuery } from "./test-helpers/execute-graphql-query";
import { factory } from "./test-helpers/factory";
import faker from "faker";
import models from "../models";

describe("createWorkspace mutation", () => {
  const createWorkspaceMutation = `
    mutation CreateWorkspace($input: CreateWorkspaceInput!) {
      createWorkspace(input: $input) {
        id
        name
        url
        allowedEmailDomain
        ownerId
        createdAt
        updatedAt
      }
    }
  `;

  describe("when given valid input", () => {
    let user;
    let workspaceName;
    let name;
    let url;
    let allowedEmailDomain;
    beforeEach(async () => {
      user = await factory.user();

      workspaceName = faker.internet.domainWord();
      name = workspaceName.toUpperCase();
      url = workspaceName;
      allowedEmailDomain = `@${workspaceName}.com`;
    });

    it("should create a workspace", async () => {
      const { data } = await executeGraphQLQuery({
        query: createWorkspaceMutation,
        userId: user.id,
        variables: {
          input: {
            name,
            url,
            allowedEmailDomain
          }
        }
      });

      expect(data).toMatchObject({
        createWorkspace: {
          id: "1",
          ownerId: user.id,
          name,
          url,
          allowedEmailDomain
        }
      });
    });

    it("should add the user to the newly created workspace", async () => {
      await executeGraphQLQuery({
        query: createWorkspaceMutation,
        userId: user.id,
        variables: {
          input: {
            name,
            url,
            allowedEmailDomain
          }
        }
      });

      const u = await models.user.findByPk(user.id);
      const workspaces = await u.getWorkspaces();

      expect(workspaces[0].workspaceUsers.userId).toBe(user.id);
    });
  });
  describe("when invalid", () => {
    it("should return an error when no input is given", async () => {
      const { errors } = await executeGraphQLQuery({
        query: createWorkspaceMutation
      });

      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe(
        'Variable "$input" of required type "CreateWorkspaceInput!" was not provided.'
      );
    });

    it("should not create a workspace if a valid user doesn't exist", async () => {
      const invalidUserId = faker.random.uuid();

      const companyName = faker.internet.domainWord();
      const name = companyName.toUpperCase();
      const url = companyName;
      const allowedEmailDomain = `@${companyName}.com`;

      const { errors } = await executeGraphQLQuery({
        query: createWorkspaceMutation,
        userId: invalidUserId,
        variables: {
          input: {
            name,
            url,
            allowedEmailDomain
          }
        }
      });

      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe(
        `Key (ownerId)=(${invalidUserId}) is not present in table "users".`
      );
    });

    it("should return an error when an existing url variable is used", async () => {
      const workspaceOne = await factory.workspace();

      const companyName = await faker.internet.domainWord();
      const name = companyName.toUpperCase();
      const allowedEmailDomain = `@${companyName}.com`;

      const { errors } = await executeGraphQLQuery({
        query: createWorkspaceMutation,
        variables: {
          input: {
            name,
            allowedEmailDomain,
            url: workspaceOne.url
          }
        }
      });

      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe(
        `Key (url)=(${workspaceOne.url}) already exists.`
      );
    });
  });
});
