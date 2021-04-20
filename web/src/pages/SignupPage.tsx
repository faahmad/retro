import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { AnalyticsPage, useAnalyticsPage } from "../hooks/use-analytics-page";
import { LoginFormContainer } from "./LoginPage";

export function SignupPage() {
  useAnalyticsPage(AnalyticsPage.SIGNUP);

  return (
    <PageContainer>
      <LoginFormContainer />
    </PageContainer>
  );
}
