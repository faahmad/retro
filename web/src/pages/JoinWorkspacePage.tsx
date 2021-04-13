import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { useHistory, useParams } from "react-router-dom";
import { LoginFormContainer } from "./LoginPage";
import { getWorkspaceURL } from "../services/get-workspace-url";
import { LoadingText } from "../components/LoadingText";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";
import { WorkspaceUrl } from "../types/workspace-url";
import { useJoinWorkspace } from "../hooks/use-join-workspace";
import { useCurrentUser } from "../hooks/use-current-user";
import { useAnalyticsEvent, AnalyticsEvent } from "../hooks/use-analytics-event";
import { AnalyticsPage } from "../hooks/use-analytics-page";
import firebase from "../lib/firebase";

export function JoinWorkspacePage() {
  const currentUser = useCurrentUser();
  const params = useParams<{ workspaceURL: string }>();
  const joinWorkspace = useJoinWorkspace();
  const history = useHistory();
  const trackEvent = useAnalyticsEvent();
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
      .then((workspaceURL) => {
        setState({ ...state, data: workspaceURL, isLoading: false });
        currentUser.handleEnqueueCallback((firebaseUser: firebase.User) => {
          joinWorkspace({
            auth: firebaseUser,
            workspaceId: workspaceURL.workspaceId,
            workspaceName: workspaceURL.name
          });
          trackEvent(AnalyticsEvent.WORKSPACE_JOINED, {
            location: AnalyticsPage.JOIN_WORKSPACE,
            userId: firebaseUser.uid,
            userEmail: firebaseUser.email,
            userDisplayName: firebaseUser.displayName,
            ...workspaceURL
          });
          history.push("/workspaces/" + workspaceURL.workspaceId);
          return;
        });
      })
      .catch((error) => setState({ ...state, error, isLoading: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.workspaceURL]);

  if (state.isLoading) {
    return <LoadingText>Loading...</LoadingText>;
  }

  return (
    <PageContainer>
      {state.error && <ErrorMessageBanner message={state.error.message} />}
      {state.data && (
        <LoginFormContainer title={`Welcome to ${state.data.name} on Retro`} />
      )}
    </PageContainer>
  );
}
