import { executeGraphQLQuery } from "./test-helpers/execute-graphql-query";
import { factory } from "./test-helpers/factory";
import faker from "faker";

describe("inviteUserToWorkspace mutation", () => {
  const inviteUserToWorkspaceMutation = `
    mutation inviteUserToWorkspace($input: InviteUserToWorkspaceInput!) {
      inviteUserToWorkspace(input: $input) {
        id
        email
        workspaceId
        invitedById
        accepted
        createdAt
        updatedAt
      }
    }
  `;

  describe("when valid", () => {
    it("should create a workspace invite record", async () => {
      const user = await factory.user();
      const workspace = await factory.workspace();
      await user.addWorkspace(workspace.id);

      const emailToInvite = faker.internet.email();

      const { data } = await executeGraphQLQuery({
        query: inviteUserToWorkspaceMutation,
        variables: {
          input: {
            email: emailToInvite,
            workspaceId: workspace.id
          }
        },
        userId: user.id
      });

      expect(data).toMatchObject({
        inviteUserToWorkspace: {
          id: "1",
          email: emailToInvite,
          workspaceId: String(workspace.id),
          invitedById: user.id,
          accepted: false
        }
      });
    });
  });
  describe("when invalid", () => {
    it("should only allow users to invite people to a workspace they are in", async () => {
      const user = await factory.user();
      const workspaceOne = await factory.workspace();
      const workspaceTwo = await factory.workspace();
      await user.addWorkspace(workspaceOne.id);

      const emailToInvite = faker.internet.email();

      const { errors, data } = await executeGraphQLQuery({
        query: inviteUserToWorkspaceMutation,
        variables: {
          input: {
            email: emailToInvite,
            workspaceId: workspaceTwo.id
          }
        },
        userId: user.id
      });

      expect(data).toMatchObject({ inviteUserToWorkspace: null });
      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe(
        "You can't invite a user to a workspace that you're not a member of."
      );
    });
    it("should not allow a user to be invited to a workspace more than once", async () => {
      const user = await factory.user();
      const workspace = await factory.workspace();
      await user.addWorkspace(workspace.id);

      const emailToInvite = faker.internet.email();

      // Invite the user once.
      await executeGraphQLQuery({
        query: inviteUserToWorkspaceMutation,
        variables: {
          input: {
            email: emailToInvite,
            workspaceId: workspace.id
          }
        },
        userId: user.id
      });

      // Invite the user again.
      const { data, errors } = await executeGraphQLQuery({
        query: inviteUserToWorkspaceMutation,
        variables: {
          input: {
            email: emailToInvite,
            workspaceId: workspace.id
          }
        },
        userId: user.id
      });

      expect(data).toMatchObject({ inviteUserToWorkspace: null });
      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe(
        "User has already been invited to this workspace."
      );
    });
  });
});
