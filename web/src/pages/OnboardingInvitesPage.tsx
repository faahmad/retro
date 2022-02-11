import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { Button } from "../components/Button";
import { Link, useHistory } from "react-router-dom";
import { useCreateWorkspaceInvite } from "../hooks/use-create-workspace-invite";
import { useAnalyticsEvent } from "../hooks/use-analytics-event";
import { useGetWorkspace } from "../hooks/use-get-workspace";
import { LoadingText } from "../components/LoadingText";
import { AnalyticsEvent } from "../hooks/use-analytics-event";
import { AnalyticsPage, useAnalyticsPage } from "../hooks/use-analytics-page";

export function OnboardingInvitesPage() {
  useAnalyticsPage(AnalyticsPage.ONBOARDING_INVITES_PAGE);

  const createWorkspaceInvite = useCreateWorkspaceInvite();
  const trackEvent = useAnalyticsEvent();
  const workspaceState = useGetWorkspace();
  const history = useHistory();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // @ts-ignore
    const email1 = event.target.email1.value;
    // @ts-ignore
    const email2 = event.target.email2.value;
    let email1Promise;
    let email2Promise;
    if (email1) {
      email1Promise = createWorkspaceInvite({
        // @ts-ignore
        email: event.target.email1.value,
        workspaceId: workspaceState.id,
        workspaceName: workspaceState.name
      });
    }
    if (email2) {
      email2Promise = createWorkspaceInvite({
        // @ts-ignore
        email: event.target.email2.value,
        workspaceId: workspaceState.id,
        workspaceName: workspaceState.name
      });
    }
    await Promise.all([email1Promise, email2Promise]);
    trackEvent(AnalyticsEvent.USER_INVITED, {
      workspaceId: workspaceState.id,
      workspaceName: workspaceState.name,
      userCount: workspaceState.userCount,
      invitedUserCount: 0,
      method: "email",
      location: AnalyticsPage.ONBOARDING_INVITES_PAGE,
      invitedBy: "workspace-owner"
    });
    history.push(`/workspaces/${workspaceState.id}`);
    return;
  };

  if (workspaceState.status === "loading") {
    return <LoadingText>Fetching workspace...</LoadingText>;
  }

  if (workspaceState.status === "error") {
    return (
      <LoadingText>Uh oh...something went wrong. Please refresh the page.</LoadingText>
    );
  }

  const emailDomain = workspaceState.allowedEmailDomains[0] || "@example.com";
  return (
    <PageContainer>
      <div className="flex flex-col text-blue">
        <p className="text-xs mb-2">Step 2 of 2</p>
        <h1 className="text-4xl">Who do you usually have retrospectives with?</h1>
        <p className="mt-2">
          To give Retro a spin, add a few team members you work with regulary.
        </p>

        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="flex flex-col mb-8">
            <div>
              <input
                name="email1"
                type="email"
                placeholder={`jerry${emailDomain}`}
                className="border border-red my-1 h-12 sm:h-8 md:h-8 lg:h-8 w-full max-w-md outline-none px-1"
              />
            </div>
            <div className="mt-4">
              <input
                name="email2"
                type="email"
                placeholder={`elaine${emailDomain}`}
                className="border border-red my-1 h-12 sm:h-8 md:h-8 lg:h-8 w-full max-w-md outline-none px-1"
              />
            </div>
          </div>

          <div className="flex items-center">
            <Button type="submit" className="text-white bg-blue mb-2 mr-12">
              Add Teammates
            </Button>

            <Link
              to={`/workspaces/${workspaceState.id}`}
              onClick={() => {
                trackEvent(AnalyticsEvent.SKIPPED_ONBOARDING_INVITES, {
                  workspaceId: workspaceState.id
                });
              }}
            >
              <p className="text-xs">Skip this step</p>
            </Link>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
