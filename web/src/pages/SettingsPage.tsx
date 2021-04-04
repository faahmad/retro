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
import { useAnalyticsPage, AnalyticsPage } from "../hooks/use-analytics-page";
import * as Sentry from "@sentry/react";
import { Button } from "../components/Button";

export const SettingsPage = () => {
  useAnalyticsPage(AnalyticsPage.SETTINGS);
  const currentUser = useCurrentUser();
  const workspaceState = useWorkspaceState();
  const [copyButtonText, setCopyButtonText] = React.useState("Copy");

  const hasBillingAccess =
    workspaceState.status === WorkspaceStateStatus.SUCCESS &&
    currentUser.data?.id === workspaceState.ownerId;

  const workspaceURL = `${window.location.origin}/secret-auth/${workspaceState.url}`;
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(workspaceURL);
      setCopyButtonText("Copied!");
      setTimeout(() => {
        setCopyButtonText("Copy");
      }, 2000);
      return;
    } catch (error) {
      Sentry.captureException(error);
      setCopyButtonText("Try again");
    }
  };

  return (
    <PageContainer>
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
          <p className="text-xl font-black py-1">{currentUser.data?.displayName}</p>
          <p className="py-1">{currentUser.data?.email}</p>
        </div>
      </div>

      <SettingsSectionContainer title="Workspace URL">
        <div className="flex flex-row items-end justify-between">
          <div>
            <p className="text-blue text-xs mb-4">
              Your team members can use this link to join you workspace after you invite
              them.
            </p>
            <p>{`${workspaceURL}`}</p>
          </div>
          <Button
            style={{ maxWidth: "8rem" }}
            className="text-blue h-8 w-16"
            onClick={handleCopyToClipboard}
          >
            {copyButtonText}
          </Button>
        </div>
      </SettingsSectionContainer>

      <AllowedEmailDomainsSection
        isAdmin={workspaceState.ownerId === currentUser.auth?.uid}
        allowedEmailDomains={workspaceState.allowedEmailDomains}
        onSubmit={() => {}}
      />

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

function SettingsSectionContainer({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-red border border-red shadow p-8 flex flex-col mt-2">
      <div className="text-blue ml-2">
        <div className="flex-grow flex flex-row justify-between">
          <p className="text-xl font-black py-1">{title}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function AllowedEmailDomainsSection({ allowedEmailDomains, isAdmin, onSubmit }: any) {
  const [isEditing, setIsEditing] = React.useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  return (
    <SettingsSectionContainer title="Allowed Email Domains">
      {isEditing ? (
        <form className="flex flex-row justify-between items-end" onSubmit={handleSubmit}>
          <div>
            <AllowedEmailDomainInputs
              allowedEmailDomains={allowedEmailDomains}
              onSubmit={onSubmit}
            />
          </div>
          <Button
            type="submit"
            style={{ maxWidth: "8rem" }}
            className="text-blue h-8 w-16"
          >
            Save
          </Button>
        </form>
      ) : (
        <div className="flex flex-row justify-between items-end">
          <p>{`${allowedEmailDomains.reduce(
            (string: string, domain: string, index: number) => {
              return (
                string + domain + (index + 1 === allowedEmailDomains.length ? "" : ", ")
              );
            },
            ""
          )}`}</p>
          <Button
            style={{ maxWidth: "8rem" }}
            className="text-blue h-8 w-16"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        </div>
      )}
    </SettingsSectionContainer>
  );
}

function AllowedEmailDomainInputs({ allowedEmailDomains }: any) {
  const [one, two, three, four, five] = allowedEmailDomains.map((domain: string) =>
    domain.replace("@", "")
  );

  return (
    <div className="flex flex-col">
      <EmailDomainInput name="0" value={one} pattern="[A-Za-z0-9.]" />
      <EmailDomainInput name="1" value={two} pattern="[A-Za-z0-9.]" />
      <EmailDomainInput name="2" value={three} pattern="[A-Za-z0-9.]" />
      <EmailDomainInput name="3" value={four} pattern="[A-Za-z0-9.]" />
      <EmailDomainInput name="4" value={five} pattern="[A-Za-z0-9.]" />
    </div>
  );
}

function EmailDomainInput({ value, onChange }: any) {
  return (
    <div className="flex">
      @
      <input
        type="text"
        defaultValue={value}
        onChange={onChange}
        className="border border-red h-12 mb-2 sm:h-8 md:h-8 lg:h-8 max-w-md outline-none px-1"
      />
    </div>
  );
}

// function RetroHeader({ id, name, createdAt, ownerId }: RetroHeaderProps) {
//   const [localName, setLocalName] = React.useState(name);
//   const handleOnChange = (event: any) => {
//     return setLocalName(event.currentTarget.value);
//   };

//   const [isEditing, setisEditing] = React.useState(false);
//   const handleToggleEditing = () => {
//     return setisEditing((prevState) => !prevState);
//   };
//   const inputRef = React.useRef(null);
//   React.useEffect(() => {
//     if (isEditing) {
//       // @ts-ignore
//       inputRef.current.focus();
//     }
//   }, [isEditing]);

//   const updateRetro = useUpdateRetro();
//   const trackEvent = useAnalyticsEvent();
//   const currentUser = useCurrentUser();
//   const handleSave = async () => {
//     await updateRetro(id, { name: localName });
//     trackEvent(AnalyticsEvent.RETRO_UPDATED, {
//       retroId: id,
//       createdAt,
//       fields: ["name"],
//       location: AnalyticsPage.RETRO_BOARD,
//       updatedBy: currentUser.auth?.uid === ownerId ? "retro-owner" : "member"
//     });
//     handleToggleEditing();
//     return;
//   };

//   return (
//     <div className="flex text-blue items-baseline justify-between mb-8">
//       <div className="flex flex-col flex-grow flex-nowrap">
//         {!isEditing ? (
//           <h1 className="text-4xl font-bold">{name || "Retro Board"}</h1>
//         ) : (
//           <input
//             ref={inputRef}
//             type="text"
//             name="name"
//             value={localName}
//             onChange={handleOnChange}
//             className="border border-red my-1 h-12 w-4/5 lg:w-full max-w-md outline-none text-xl px-1"
//           />
//         )}
//         <span className="text-xs font-normal">
//           Created {moment(createdAt.toDate()).format("L")}
//         </span>
//       </div>
//       {!isEditing ? (
//         <button
//           aria-label="edit title button"
//           className="flex items-center px-4 border border blue"
//           onClick={handleToggleEditing}
//         >
//           <span>Edit</span>
//         </button>
//       ) : (
//         <button
//           className="flex items-center px-4 bg-blue text-white"
//           onClick={handleSave}
//         >
//           Save
//         </button>
//       )}
//     </div>
//   );
// }
