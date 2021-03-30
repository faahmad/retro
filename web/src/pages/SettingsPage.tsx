import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { Title } from "../components/Typography";
import { UserAvatar } from "../components/UserAvatar";
// import moment from "moment";
// import { PencilEditIcon } from "../components/PencilEditIcon";
// import { useParams } from "react-router-dom";
// import { dollarAmountAdapter } from "../utils/dollar-amount-adapter";
// import { useOpenBillingPortal } from "../hooks/use-open-billing-portal";
// import { UpgradeToProBanner } from "../components/UpgradeToProBanner";
import { useCurrentUser } from "../hooks/use-current-user";

export const SettingsPage = () => {
  const { auth } = useCurrentUser();
  // const params = useParams<{ workspaceId: string }>();
  // const hasBillingAccess = !loading && data.workspace.subscription;

  return (
    <PageContainer>
      <Title>Settings</Title>
      <div className="text-red border border-red shadow p-8 flex mt-4">
        <UserAvatar
          size="xl"
          displayName={auth!.displayName || undefined}
          photoURL={auth!.photoURL || undefined}
        />
        <div className="text-blue ml-2">
          <p className="text-xl font-black py-1">{auth!.displayName}</p>
          <p className="py-1">{auth!.email}</p>
        </div>
      </div>
      {/* {hasBillingAccess && (
        <div className="mt-8">
          <h5 className="text-blue">Admin Land</h5>
          <BillingSettings
            workspaceId={data.workspace.id}
            subscription={data.workspace.subscription}
          />
        </div>
      )} */}
    </PageContainer>
  );
};

// type BillingSettingsProps = {
//   workspaceId: string;
//   subscription: any;
// };
// function BillingSettings({ workspaceId, subscription }: BillingSettingsProps) {
//   const { openBillingPortalFn, isOpeningPortal } = useOpenBillingPortal(workspaceId);
//   const isSubscriptionActive = subscription.status === "active";

//   return (
//     <div className="text-red border border-red shadow p-8 flex flex-col mt-2">
//       <div className="text-blue ml-2">
//         <div className="flex-grow flex flex-row justify-between">
//           <p className="text-xl font-black py-1">Billing</p>
//           {isSubscriptionActive && (
//             <button
//               className="active:transform-1 border-none rounded-none focus:outline-none"
//               onClick={openBillingPortalFn}
//               disabled={isOpeningPortal}
//             >
//               {isOpeningPortal ? "Redirecting you to Stripe" : <PencilEditIcon />}
//             </button>
//           )}
//         </div>
//         {isSubscriptionActive ? (
//           <SubscriptionActiveText
//             amount={subscription.plan.amount}
//             currentPeriodEnd={subscription.currentPeriodEnd}
//             interval={subscription.plan.interval}
//           />
//         ) : (
//           <UpgradeToProBanner
//             trialEnd={subscription.trialEnd}
//             workspaceId={workspaceId}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// function SubscriptionActiveText({ amount, currentPeriodEnd, interval }: any) {
//   return (
//     <React.Fragment>
//       <p className="py-4">
//         This workspace's Pro Plan is{" "}
//         <span className="font-black">${dollarAmountAdapter.fromSource(amount)}</span> a{" "}
//         {interval} and will renew on{" "}
//         <span className="font-black">{moment.unix(currentPeriodEnd).calendar()}</span>.
//       </p>
//       <p className="text-xs py-4">
//         The Pro Plan includes unlimited members, teams, and retros.
//       </p>
//     </React.Fragment>
//   );
// }
