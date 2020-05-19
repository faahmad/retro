import { factory } from "./test-helpers/factory";
import { executeGraphQLQuery } from "./test-helpers/execute-graphql-query";
import { getWorkspaceSubscription } from "../services/subscription";

describe("workspace query", () => {
  const workspaceQuery = `
    query Workspace($id: ID!) {
      workspace(id: $id) {
        id
        name
        url
        allowedEmailDomain
        ownerId
        subscription {
          id
        }
      }
    }
  `;

  it("should return the workspace if the user belongs to it", async () => {
    const user = await factory.user();
    const workspace = await factory.createWorkspace({}, user);

    const queryResult = await executeGraphQLQuery({
      query: workspaceQuery,
      userId: user.id,
      variables: { id: workspace.id }
    });

    expect(queryResult).toMatchObject({
      data: {
        workspace: {
          id: String(workspace.id),
          name: workspace.name,
          url: workspace.url,
          allowedEmailDomain: workspace.allowedEmailDomain,
          ownerId: workspace.ownerId
        }
      }
    });
  });
  it("should throw an error if the user does not belong to the workspace", async () => {
    const user = await factory.user();
    const workspace = await factory.createWorkspace({}, user);

    const outsideUser = await factory.user();

    const { data, errors } = await executeGraphQLQuery({
      query: workspaceQuery,
      userId: outsideUser.id,
      variables: { id: workspace.id }
    });

    expect(data).toMatchObject({
      workspace: null
    });
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe("You don't have access to this workspace.");
  });
  it("should expose the subscription to the workspace owner", async () => {
    const user = await factory.user();
    const workspace = await factory.createWorkspace({}, user);

    await executeGraphQLQuery({
      query: workspaceQuery,
      userId: user.id,
      variables: { id: workspace.id }
    });

    expect(getWorkspaceSubscription).toHaveBeenCalledWith(String(workspace.id));
  });
  it("should not expose the subscription to a workspace user", async () => {
    const owner = await factory.user();
    const workspace = await factory.createWorkspace({}, owner);
    const regularUser = await factory.user();
    regularUser.addWorkspace(workspace.id);

    await executeGraphQLQuery({
      query: workspaceQuery,
      userId: regularUser.id,
      variables: { id: workspace.id }
    });

    expect(getWorkspaceSubscription).not.toHaveBeenCalled();
  });
});
