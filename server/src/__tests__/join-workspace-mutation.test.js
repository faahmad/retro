import { executeGraphQLQuery } from "./test-helpers/execute-graphql-query";
import { factory } from "./test-helpers/factory";
import faker from "faker";
import models from "../models";

describe("joinWorkspace mutation", () => {
  const joinWorkspaceMutation = `
    mutation JoinWorkspace($workspaceId: ID!) {
      joinWorkspace(workspaceId: $workspaceId) {
        code
        success
        message
      }
    }
  `;

  describe("when valid", () => {
    const successfullMutationResponse = {
      joinWorkspace: {
        code: "200",
        success: true,
        message: "Successfully added user to workspace."
      }
    };

    const setupWorkspaceInviteTest = async () => {
      // Create a workspace.
      const owner = await factory.user();
      const workspace = await factory.createWorkspace(null, owner);
      await owner.addWorkspace(workspace.id);

      // Invite the user to the workspace.
      const newUserEmail = faker.internet.email();
      await factory.workspaceInvite({
        email: newUserEmail,
        workspaceId: workspace.id,
        invitedById: owner.id
      });

      const newUser = await factory.user({ email: newUserEmail });

      return { workspace, newUser };
    };
    it("should add a user to the workspace that they were invited to", async () => {
      const { workspace, newUser } = await setupWorkspaceInviteTest();

      const { data } = await executeGraphQLQuery({
        query: joinWorkspaceMutation,
        variables: { workspaceId: workspace.id },
        userId: newUser.id
      });

      expect(data).toMatchObject(successfullMutationResponse);
    });
    it("should add the user to the default team", async () => {
      const { workspace, newUser } = await setupWorkspaceInviteTest();

      await executeGraphQLQuery({
        query: joinWorkspaceMutation,
        variables: { workspaceId: workspace.id },
        userId: newUser.id
      });

      const user = await models.user.findByPk(newUser.id);
      const teams = await user.getTeams();

      expect(teams[0]).toMatchObject({
        workspaceId: workspace.id,
        name: "Default"
      });
    });
    it("should update the workspaceInvite if the user joins the workspace", async () => {
      const { workspace, newUser } = await setupWorkspaceInviteTest();

      await executeGraphQLQuery({
        query: joinWorkspaceMutation,
        variables: { workspaceId: workspace.id },
        userId: newUser.id
      });

      const workspaceInvite = await models.workspaceInvite.findOne({
        where: {
          workspaceId: workspace.id,
          email: newUser.email
        }
      });

      expect(workspaceInvite.accepted).toBe(true);
    });
    it("should add a user to a workspace if they have an allowedEmailDomain", async () => {
      const owner = await factory.user();
      const workspace = await factory.createWorkspace(null, owner);

      const newUser = await factory.user({
        email: "test" + workspace.allowedEmailDomain
      });

      const { data } = await executeGraphQLQuery({
        query: joinWorkspaceMutation,
        variables: { workspaceId: workspace.id },
        userId: newUser.id
      });

      expect(data).toMatchObject(successfullMutationResponse);
    });
  });
  describe("when invalid", () => {});
});
