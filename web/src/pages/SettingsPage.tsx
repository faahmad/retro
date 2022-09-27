import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { Title } from "../components/Typography";
import { UserAvatar } from "../components/UserAvatar";
import moment from "moment";
import { PencilEditIcon } from "../components/PencilEditIcon";
import { dollarAmountAdapter } from "../utils/dollar-amount-adapter";
import { useOpenBillingPortal } from "../hooks/use-open-billing-portal";
import { UpgradeToProBanner } from "../components/UpgradeToProBanner";
import { useGetWorkspace } from "../hooks/use-get-workspace";
import { useCurrentUser } from "../hooks/use-current-user";
import { WorkspaceStateStatus } from "../hooks/use-get-workspace";
import { useAnalyticsPage, AnalyticsPage } from "../hooks/use-analytics-page";
import { Navbar } from "../components/Navbar";
import { WorkspaceUsersTable } from "../components/WorkspaceUsersTable";
import { logOut } from "../services/auth-service";
import { useHistory } from "react-router-dom";
import { BannerTrialEnded } from "../components/BannerTrialEnded";
import { Workspace } from "../types/workspace";
import { Button } from "../components/Button";
import { updateWorkspace } from "../services/update-workspace";
import { useGetWorkspaceSubscription } from "../hooks/use-get-workspace-subscription";

export const SettingsPage = () => {
  useAnalyticsPage(AnalyticsPage.SETTINGS);
  const currentUser = useCurrentUser();
  const workspaceState = useGetWorkspace();
  const history = useHistory();

  const currentUserId = currentUser?.auth?.uid;

  if (
    workspaceState.status === WorkspaceStateStatus.LOADING ||
    !Object.values(workspaceState.users).length
  ) {
    return <p>Loading...</p>;
  }

  const currentWorkspaceUser = currentUserId ? workspaceState.users[currentUserId] : null;
  const hasBillingAccess =
    workspaceState.status === WorkspaceStateStatus.SUCCESS &&
    currentWorkspaceUser?.userRole === "owner";

  async function handleLogout() {
    await logOut();
    history.push("/");
  }

  return (
    <PageContainer>
      <Navbar isLoggedIn />
      <p className="text-blue mb-2 underline">{workspaceState.name}</p>
      <div className="flex justify-between">
        <Title>Settings</Title>
        <button className="text-red" onClick={handleLogout}>
          Log out
        </button>
      </div>
      <div className="text-red border border-red shadow p-8 flex mt-4">
        <UserAvatar
          size="xl"
          displayName={
            currentUser.data?.displayName || currentUser.data?.email || undefined
          }
          photoURL={currentUser.data?.photoUrl || undefined}
        />
        <div className="text-blue ml-2">
          <p className="text-xl font-black py-1">
            {currentUser.data?.displayName || "--"}{" "}
            <span className="text-pink">
              ({currentWorkspaceUser?.userRole === "owner" ? "admin" : "member"})
            </span>
          </p>
          <p className="py-1">{currentUser.data?.email}</p>
        </div>
      </div>

      {hasBillingAccess && (
        <div className="mt-8 p-4 border border-blue border-dashed">
          <h5 className="text-blue text-xl underline">Workspace Admin Controls</h5>
          <GeneralSettings workspaceId={workspaceState.id} name={workspaceState.name} />
          <BillingSettings
            workspaceId={workspaceState.id}
            isWorkspaceAdmin={hasBillingAccess}
          />
          <div className="my-4" />
          <WorkspaceUsersTable
            workspaceId={workspaceState.id}
            users={Object.values(workspaceState.users)}
          />
        </div>
      )}
    </PageContainer>
  );
};

function GeneralSettings({
  workspaceId,
  name
}: {
  workspaceId: Workspace["id"];
  name: Workspace["name"];
}) {
  const [isEditing, setIsEditing] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // @ts-ignore
    const nextName = event.currentTarget.name?.value as string;
    await updateWorkspace(workspaceId, { name: nextName });
    setIsEditing(false);
  };

  return (
    <div className="text-red border border-red shadow p-8 flex flex-col mt-2 mb-4">
      <div className="text-blue ml-2">
        <p className="text-xl font-black py-1">General</p>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <div className="flex-1">
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="border border-red px-1 block shadow-sm text-blue h-8 w-1/2 mt-1"
                  defaultValue={name}
                />
              </div>
              <Button style={{ maxWidth: "8rem" }} className="flex-2" type="submit">
                Save
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex justify-between">
            <div className="flex-1">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <p>{name}</p>
            </div>
            <Button
              style={{ maxWidth: "8rem" }}
              className="flex-2"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

type BillingSettingsProps = {
  workspaceId: string;
  isWorkspaceAdmin: boolean;
};
function BillingSettings({ workspaceId, isWorkspaceAdmin }: BillingSettingsProps) {
  const { openBillingPortalFn, isOpeningPortal } = useOpenBillingPortal(workspaceId);
  const workspaceState = useGetWorkspace();
  const { subscription } = useGetWorkspaceSubscription(workspaceId);

  if (!subscription) {
    return null;
  }

  const isTrialing = subscription.status === "trialing";
  const isSubscriptionActive = subscription.status === "active";

  return (
    <div className="text-red border border-red shadow p-8 flex flex-col mt-2 mb-4">
      <div className="text-blue ml-2">
        <p className="text-xl font-black py-1">Billing</p>
        {workspaceState?.subscriptionId && (
          <div className="flex-grow flex flex-row justify-between">
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
        )}
        {isSubscriptionActive ? (
          <SubscriptionActiveText
            amount={subscription.items[0].amount}
            currentPeriodEnd={subscription.currentPeriodEnd}
            interval={subscription.items[0].interval}
          />
        ) : isTrialing ? (
          <UpgradeToProBanner
            workspaceId={workspaceId}
            trialEnd={subscription.trialEnd}
          />
        ) : !isSubscriptionActive ? (
          <BannerTrialEnded
            workspaceId={workspaceId}
            isWorkspaceAdmin={isWorkspaceAdmin}
          />
        ) : null}
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
    </React.Fragment>
  );
}
