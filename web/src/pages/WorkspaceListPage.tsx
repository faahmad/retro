import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { useCurrentUser } from "../hooks/use-current-user";
import { UserWorkspace } from "../types/user";

export function WorkspaceListPage() {
  const currentUser = useCurrentUser();

  console.log({ currentUserState: currentUser?.state });
  if (currentUser.state === "loading") {
    return (
      <PageContainer>
        <p>Loading...</p>
      </PageContainer>
    );
  }

  const workspaces = currentUser.data?.workspaces || [];

  if (!workspaces.length) {
    return <Redirect to="/onboarding" />;
  }

  return (
    <PageContainer>
      <h1 className="text-xl mb-4">Select your workspace</h1>
      <WorkspaceList workspaces={workspaces} />
    </PageContainer>
  );
}

function WorkspaceList({ workspaces }: { workspaces: UserWorkspace[] }) {
  return (
    <React.Fragment>
      <h2>Your workspaces</h2>
      <ul>
        {workspaces.map((workspace) => (
          <li key={workspace.id} className="ml-4 text-blue underline cursor">
            <Link to={`/workspaces/${workspace.id}`}>{workspace.name}</Link>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
}
