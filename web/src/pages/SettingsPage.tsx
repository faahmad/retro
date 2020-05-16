import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { Button } from "../components/Button";
import { createStripeCheckoutSession } from "../services/stripe";

const dummyData = {
  workspaceId: "1",
  successUrl: "http://localhost:3000/workspace/1",
  cancelUrl: "http://localhost:3000/workspace/1/settings",
};

export const SettingsPage = () => {
  const [checkoutSession, setCheckoutSession] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const handleFetchCheckoutSession = async () => {
    setIsLoading(true);
    const response = await createStripeCheckoutSession(dummyData);
    setCheckoutSession(response.data);
    setIsLoading(false);
    return;
  };

  return (
    <PageContainer>
      {isLoading && <p>Loading...</p>}
      {!isLoading && !checkoutSession && (
        <Button onClick={handleFetchCheckoutSession}>Upgrade to PRO</Button>
      )}
      {!isLoading && checkoutSession && (
        <code>
          <pre>{JSON.stringify(checkoutSession, null, 2)}</pre>
        </code>
      )}
    </PageContainer>
  );
};
