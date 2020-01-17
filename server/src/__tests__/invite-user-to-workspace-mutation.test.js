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
    xit("should only allow users to invite people to a workspace they are in", () => {});
    xit("should not allowe a user to be invited to a workspace more than once", () => {});
    xit("should not allowe a user to be invited to a workspace more than once", () => {});
  });
});
