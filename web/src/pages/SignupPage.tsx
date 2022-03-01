import * as React from "react";
import { Navbar } from "../components/Navbar";
import { PageContainer } from "../components/PageContainer";
import { AnalyticsPage, useAnalyticsPage } from "../hooks/use-analytics-page";
import { LoginFormContainer } from "./LoginPage";

export function SignupPage() {
  useAnalyticsPage(AnalyticsPage.SIGNUP);

  return (
    <PageContainer>
      <Navbar isLoggedIn={false} />
      <LoginFormContainer title="Sign up" type="signup" />
    </PageContainer>
  );
}
