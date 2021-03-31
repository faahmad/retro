import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { Title } from "../components/Typography";
import { UserAvatar } from "../components/UserAvatar";
import moment from "moment";
import { PencilEditIcon } from "../components/PencilEditIcon";
import { dollarAmountAdapter } from "../utils/dollar-amount-adapter";
import { useOpenBillingPortal } from "../hooks/use-open-billing-portal";
import { UpgradeToProBanner } from "../components/UpgradeToProBanner";
import { useWorkspaceState } from "../hooks/use-workspace-state";
import { useCurrentUser } from "../hooks/use-current-user";
import { WorkspaceStateStatus } from "../contexts/WorkspaceStateContext";
import { axios } from "../lib/axios";
import { getBaseURL } from "../services/stripe-service";

export const SettingsPage = () => {
  const currentUser = useCurrentUser();
  const workspaceState = useWorkspaceState();

  const hasBillingAccess =
    workspaceState.status === WorkspaceStateStatus.SUCCESS &&
    currentUser.data?.id === workspaceState.ownerId;

  return (
    <PageContainer>
      <Title>Settings</Title>
      <div className="text-red border border-red shadow p-8 flex mt-4">
        <UserAvatar
          size="xl"
          displayName={currentUser.data?.displayName || undefined}
          photoURL={currentUser.data?.photoUrl || undefined}
        />
        <div className="text-blue ml-2">
          <p className="text-xl font-black py-1">{currentUser.data?.displayName}</p>
          <p className="py-1">{currentUser.data?.email}</p>
        </div>
      </div>
      {hasBillingAccess && (
        <div className="mt-8">
          <h5 className="text-blue">Admin Land</h5>
          <BillingSettings workspaceId={workspaceState.id} />
        </div>
      )}
    </PageContainer>
  );
};

type BillingSettingsProps = {
  workspaceId: string;
};
function BillingSettings({ workspaceId }: BillingSettingsProps) {
  const { openBillingPortalFn, isOpeningPortal } = useOpenBillingPortal(workspaceId);
  const [subscription, setSubscription] = React.useState<any>(null);
  const isSubscriptionActive = subscription?.status === "active";

  React.useEffect(() => {
    axios
      .post(getBaseURL() + "/getStripeSubscription", {
        workspaceId
      })
      .then((response) => setSubscription(response.data));

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!subscription) {
    return null;
  }

  console.log({ subscription });

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
            amount={subscription.items[0].amount}
            currentPeriodEnd={subscription.currentPeriodEnd}
            interval={subscription.items[0].interval}
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
