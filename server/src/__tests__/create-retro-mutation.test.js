import { executeGraphQLQuery } from "./test-helpers/execute-graphql-query";
import { factory } from "./test-helpers/factory";

describe("createRetro mutation", () => {
  const createRetroMutation = `
    mutation($input: CreateRetroInput!) {
      createRetro(input: $input) {
        id
        name
        teamId
        workspaceId
        createdById
        createdAt
        updatedAt
      }
    }
  `;

  describe("when given valid input", () => {
    it("should create a retro", async () => {
      const user = await factory.user();
      const workspace = await factory.createWorkspace({}, user);
      const [team] = await user.getTeams({
        where: { workspaceId: workspace.id }
      });

      const variables = {
        input: {
          teamId: team.id
        }
      };

      const response = await executeGraphQLQuery({
        query: createRetroMutation,
        userId: user.id,
        variables
      });

      expect(response.data).toMatchObject({
        createRetro: {
          name: "",
          createdById: user.id,
          teamId: String(team.id),
          workspaceId: String(workspace.id)
        }
      });
    });
  });
  describe("when invalid", () => {
    it("should only allow a user to create a retro if they belong to that workspace", async () => {
      const userOne = await factory.user();
      const workspaceOne = await factory.createWorkspace({}, userOne);

      const userTwo = await factory.user();
      await factory.createWorkspace({}, userTwo);

      const [team] = await userOne.getTeams({
        where: { workspaceId: workspaceOne.id }
      });

      const response = await executeGraphQLQuery({
        query: createRetroMutation,
        userId: userTwo.id,
        variables: { input: { teamId: team.id } }
      });

      expect(response.errors.length).toBe(1);
      expect(response.errors[0].message).toBe(
        "You can't create a retro unless you belong to this team."
      );
    });
  });
});
