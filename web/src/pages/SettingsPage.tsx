import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { Title } from "../components/Typography";
import { UserAvatar } from "../components/UserAvatar";
import { useAuthContext } from "../contexts/AuthContext";
import moment from "moment";
import { PencilEditIcon } from "../components/PencilEditIcon";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import { dollarAmountAdapter } from "../utils/dollar-amount-adapter";
import { useOpenBillingPortal } from "../hooks/use-open-billing-portal";
import { UpgradeToProBanner } from "../components/UpgradeToProBanner";

const WORKSPACE_SUBSCRIPTION_QUERY = gql`
  query WorkspaceSubscriptionQuery($id: ID!) {
    workspace(id: $id) {
      id
      subscription {
        id
        status
        trialEnd
        currentPeriodEnd
        plan {
          id
          active
          amount
          currency
          interval
          productId
        }
      }
    }
  }
`;

export const SettingsPage = () => {
  const currentUser = useAuthContext();
  const params = useParams<{ workspaceId: string }>();
  const { data, loading } = useQuery(WORKSPACE_SUBSCRIPTION_QUERY, {
    variables: { id: params.workspaceId }
  });
  const hasBillingAccess = !loading && data.workspace.subscription;

  return (
    <PageContainer>
      <Title>Settings</Title>
      <div className="text-red border border-red shadow p-8 flex mt-4">
        <UserAvatar
          size="xl"
          displayName={currentUser?.displayName || undefined}
          photoURL={currentUser?.photoURL || undefined}
        />
        <div className="text-blue ml-2">
          <p className="text-xl font-black py-1">{currentUser?.displayName}</p>
          <p className="py-1">{currentUser?.email}</p>
        </div>
      </div>
      {hasBillingAccess && (
        <div className="mt-8">
          <h5 className="text-blue">Admin Land</h5>
          <BillingSettings
            workspaceId={data.workspace.id}
            subscription={data.workspace.subscription}
          />
        </div>
      )}
    </PageContainer>
  );
};

type BillingSettingsProps = {
  workspaceId: string;
  subscription: any;
};
function BillingSettings({ workspaceId, subscription }: BillingSettingsProps) {
  const { openBillingPortalFn, isOpeningPortal } = useOpenBillingPortal(workspaceId);
  const isSubscriptionActive = subscription.status === "active";

  return (
    <div className="text-red border border-red shadow p-8 flex flex-col mt-2">
      <div className="text-blue ml-2">
        <div className="flex-grow flex flex-row justify-between">
          <p className="text-xl font-black py-1">Billing</p>
          {isSubscriptionActive && (
            <button
              className="active:transform-1 border-none rounded-none focus:outline-none"
              onClick={openBillingPortalFn}
              disabled={isOpeningPortal}
            >
              {isOpeningPortal ? "Redirecting you to Stripe" : <PencilEditIcon />}
            </button>
          )}
        </div>
        {isSubscriptionActive ? (
          <SubscriptionActiveText
            amount={subscription.plan.amount}
            currentPeriodEnd={subscription.currentPeriodEnd}
            interval={subscription.plan.interval}
          />
        ) : (
          <UpgradeToProBanner
            trialEnd={subscription.trialEnd}
            workspaceId={workspaceId}
          />
        )}
      </div>
    </div>
  );
}

function SubscriptionActiveText({ amount, currentPeriodEnd, interval }: any) {
  return (
    <React.Fragment>
      <p className="py-4">
        This workspace's Pro Plan is{" "}
        <span className="font-black">${dollarAmountAdapter.fromSource(amount)}</span> a{" "}
        {interval} and will renew on{" "}
        <span className="font-black">{moment.unix(currentPeriodEnd).calendar()}</span>.
      </p>
      <p className="text-xs py-4">
        The Pro Plan includes unlimited members, teams, and retros.
      </p>
    </React.Fragment>
  );
}
