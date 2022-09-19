import * as React from "react";
import { RetroCard } from "../components/RetroCard";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";
import { LoadingText } from "../components/LoadingText";
import { PageContainer } from "../components/PageContainer";
import { WorkspaceStateStatus } from "../hooks/use-get-workspace";
import { useGetWorkspace } from "../hooks/use-get-workspace";
import { Retro } from "../types/retro";
import { useHistory } from "react-router-dom";
import analytics from "analytics.js";
import { AnalyticsPage, useAnalyticsPage } from "../hooks/use-analytics-page";
import { Navbar } from "../components/Navbar";

export function RetroListPage() {
  useAnalyticsPage(AnalyticsPage.RETRO_LIST);
  const history = useHistory();
  const handleRedirectToRetroPage = (retro: Retro) => {
    analytics.track("Retro Opened", { ...retro, location: AnalyticsPage.RETRO_LIST });
    return history.push(`/workspaces/${retro.workspaceId}/retros/${retro.id}`);
  };
  const { status, retros, name, users } = useGetWorkspace();

  if (status === WorkspaceStateStatus.LOADING) {
    return <LoadingText>Loading...</LoadingText>;
  }

  const hasError = status === WorkspaceStateStatus.ERROR;

  return (
    <PageContainer>
      <Navbar isLoggedIn />
      {hasError && (
        <ErrorMessageBanner message="It was probably us. Please try again in a couple minutes." />
      )}
      <p className="text-blue mb-2 underline">{name}</p>
      <h1 className="text-blue font-black text-3xl">All Retros</h1>
      <div className="flex flex-wrap">
        {retros.map((retro) => {
          return (
            <RetroCard
              key={retro.id}
              retro={retro}
              workspaceUsersMap={users}
              onClick={() => handleRedirectToRetroPage(retro)}
            />
          );
        })}
      </div>
    </PageContainer>
  );
}
