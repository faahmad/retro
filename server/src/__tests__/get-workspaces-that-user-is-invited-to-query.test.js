import { executeGraphQLQuery } from "./test-helpers/execute-graphql-query";
import { factory } from "./test-helpers/factory";

describe("getWorkspacesThatUserIsInvitedTo query", () => {
  const getWorkspacesThatUserIsInvitedToQuery = `
    query {
      getWorkspacesThatUserIsInvitedTo {
        id
        name
      }
    }
  `;

  describe("when valid", () => {
    it("should return a list of workspaces", async () => {
      const existingUser = await factory.user();
      const workspace = await factory.workspace();
      await existingUser.addWorkspace(workspace.id);

      const newUser = await factory.user();

      await factory.workspaceInvite({
        workspaceId: workspace.id,
        invitedById: existingUser.id,
        email: newUser.email
      });

      const { data } = await executeGraphQLQuery({
        query: getWorkspacesThatUserIsInvitedToQuery,
        userId: newUser.id
      });

      expect(data).toMatchObject({
        getWorkspacesThatUserIsInvitedTo: [
          {
            id: String(workspace.id),
            name: workspace.name
          }
        ]
      });
    });
    it("should return an empty array when there are no invites", async () => {
      const newUser = await factory.user();

      const { data } = await executeGraphQLQuery({
        query: getWorkspacesThatUserIsInvitedToQuery,
        userId: newUser.id
      });

      expect(data).toMatchObject({
        getWorkspacesThatUserIsInvitedTo: []
      });
    });
  });
});
