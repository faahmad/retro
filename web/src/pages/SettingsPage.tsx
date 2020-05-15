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
  const handleOnClick = async () => {
    const response = await createStripeCheckoutSession(dummyData);
    debugger;
    return;
  };

  return (
    <PageContainer>
      <h1 className="text-2xl font-black text-blue mb-2">Settings</h1>
      <Button onClick={handleOnClick}>Upgrade to PRO</Button>
    </PageContainer>
  );
};
