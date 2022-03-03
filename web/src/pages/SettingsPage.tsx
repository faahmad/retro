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
import { axios } from "../lib/axios";
import { getBaseURL } from "../services/stripe-service";
import { useAnalyticsPage, AnalyticsPage } from "../hooks/use-analytics-page";
import { Navbar } from "../components/Navbar";
import { WorkspaceUser } from "../types/workspace-user";
import { Workspace } from "../types/workspace";
import { useUpdateWorkspaceUser } from "../hooks/use-update-workspace-user";
import { Modal } from "../components/Modal";
import { Button } from "../components/Button";
import { useRemoveWorkspaceUser } from "../hooks/use-remove-workspace-user";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";

export const SettingsPage = () => {
  useAnalyticsPage(AnalyticsPage.SETTINGS);
  const currentUser = useCurrentUser();
  const workspaceState = useGetWorkspace();

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

  return (
    <PageContainer>
      <Navbar isLoggedIn />
      <Title>Settings</Title>
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
            <span className="text-pink">({currentWorkspaceUser?.userRole})</span>
          </p>
          <p className="py-1">{currentUser.data?.email}</p>
        </div>
      </div>

      {hasBillingAccess && (
        <div className="mt-8">
          <h5 className="text-blue">Admin Land</h5>
          <BillingSettings workspaceId={workspaceState.id} />
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
    </React.Fragment>
  );
}

type ActionSetT = { type: "set"; email: string; userId: string };
type ActionUnsetT = { type: "unset"; email: null; userId: null };
type ActionT = ActionSetT | ActionUnsetT;

function WorkspaceUsersTable({
  workspaceId,
  users
}: {
  workspaceId: Workspace["id"];
  users: WorkspaceUser[];
}) {
  const [errorMessage, setErrorMessage] = React.useState("");
  const currentUser = useCurrentUser();
  const updateWorkspaceUser = useUpdateWorkspaceUser(workspaceId);
  async function handleChangeRole(
    workspaceUserId: WorkspaceUser["userId"],
    role: WorkspaceUser["userRole"]
  ) {
    try {
      await updateWorkspaceUser(workspaceUserId, { userRole: role });
    } catch (error) {
      // @ts-ignore
      setErrorMessage(error.message);
    }
  }
  const removeWorkspaceUser = useRemoveWorkspaceUser(workspaceId);
  async function handleRemoveWorkspaceUser(workspaceUserId: WorkspaceUser["userId"]) {
    try {
      await removeWorkspaceUser(workspaceUserId);
    } catch (error) {
      // @ts-ignore
      setErrorMessage(error.message);
    }
  }

  const [state, dispatch] = React.useReducer(
    (state, action: ActionT) => {
      const map = {
        set: (action: ActionT) => ({
          ...state,
          isModalOpen: true,
          email: action.email,
          userId: action.userId
        }),
        unset: () => ({
          ...state,
          isModalOpen: false,
          email: null,
          userId: null
        })
      };
      return map[action.type](action) || state;
    },
    {
      isModalOpen: false,
      email: null,
      userId: null
    }
  );
  function handleOpen({ email, userId }: { email: string; userId: string }) {
    return dispatch({ type: "set", email, userId });
  }
  function handleClose() {
    return dispatch({ type: "unset", email: null, userId: null });
  }

  return (
    <React.Fragment>
      <Modal isOpen={state.isModalOpen} onRequestClose={handleClose}>
        <div className="text-blue flex flex-col">
          <h2 className="text-lg mb-2 font-bold">Remove {state.email}?</h2>
          <p>
            Are you sure you want to remove this person from the workspace? They will no
            longer have access to the retrospectives.
          </p>
          <div className="space-y-48">
            <Button className="mr-8" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="bg-red text-white border-white shadow-red"
              onClick={() => {
                handleRemoveWorkspaceUser(state.userId);
                handleClose();
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </Modal>

      <h2 className="text-xl text-blue font-bold">Team members</h2>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow shadow-red overflow-hidden border border-red">
              <table className="min-w-full divide-y divide-red">
                <thead className="text-blue">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.userId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue">
                        {user.userDisplayName || "--"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue">
                        {user.userEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue">
                        {user.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue">
                        <select
                          className="border border-blue px-2"
                          value={user.userRole}
                          onChange={(event) => {
                            const role = event.target.value as WorkspaceUser["userRole"];
                            handleChangeRole(user.userId, role);
                          }}
                        >
                          <option value="member">member</option>
                          <option value="owner">owner</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs underline text-red">
                        {user.userId !== currentUser?.auth?.uid ? (
                          <button
                            className="hover:text-pink"
                            onClick={() =>
                              handleOpen({ email: user.userEmail, userId: user.userId })
                            }
                          >
                            Remove
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {errorMessage && (
        <div className="mt-4">
          <ErrorMessageBanner
            title="Oops, something went wrong. Our bad. Please try again."
            message={errorMessage}
          />
        </div>
      )}
    </React.Fragment>
  );
}
