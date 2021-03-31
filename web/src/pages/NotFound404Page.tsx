import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { Link } from "react-router-dom";
import { useAnalyticsPage, AnalyticsPage } from "../hooks/use-analytics-page";

export function NotFound404Page() {
  useAnalyticsPage(AnalyticsPage.NOT_FOUND);
  return (
    <PageContainer>
      <h1>Oops! We couldn't find the page you were looking for.</h1>
      <Link to="/">Go home.</Link>
    </PageContainer>
  );
}
