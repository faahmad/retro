import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { useParams } from "react-router-dom";
import { Login } from "./LoginPage";
import { getWorkspaceURL } from "../services/get-workspace-url";
import { LoadingText } from "../components/LoadingText";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";
import { WorkspaceUrl } from "../types/workspace-url";
import { useJoinWorkspace } from "../hooks/use-join-workspace-from-invite";

export function JoinWorkspacePage() {
  const params = useParams<{ workspaceURL: string }>();
  const [state, setState] = React.useState<{
    data: WorkspaceUrl | null;
    error: Error | null;
    isLoading: boolean;
  }>({
    data: null,
    error: null,
    isLoading: true
  });
  React.useEffect(() => {
    getWorkspaceURL(params.workspaceURL)
      .then((workspaceURL) =>
        setState({ ...state, data: workspaceURL, isLoading: false })
      )
      .catch((error) => setState({ ...state, error, isLoading: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.workspaceURL]);

  if (state.isLoading) {
    return <LoadingText>Loading...</LoadingText>;
  }

  console.log({ state });

  return (
    <PageContainer>
      {state.error && <ErrorMessageBanner message={state.error.message} />}
      {state.data && <Login title={`Welcome to ${state.data.name} on Retro`} />}
    </PageContainer>
  );
}
