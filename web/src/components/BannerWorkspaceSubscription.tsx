import * as React from "react";
import * as moment from "moment";
import { StripeSubscriptionStatus } from "../types/stripe-subscription-status";
import { ButtonCheckoutSession } from "./ButtonCheckoutSession";

interface Props {
  workspaceId: string;
  isWorkspaceAdmin: boolean;
  subscriptionTrialEnd: number;
  subscriptionStatus: StripeSubscriptionStatus;
  paymentMethodId: string | null | undefined;
}

export function BannerWorkspaceSubscription(props: Props) {
  const hasPaymentMethod = Boolean(props.paymentMethodId);

  // When trialing, use checkoutSession with SETUP
  if (props.subscriptionStatus === "trialing" && !hasPaymentMethod) {
    if (!props.isWorkspaceAdmin) {
      return <AccountInactiveNonAdminBannerNoCTA />;
    }
    return (
      <TrialingBannerCheckoutCTA
        workspaceId={props.workspaceId}
        status={props.subscriptionStatus}
      />
    );
  }

  if (props.subscriptionStatus === "trialing" && hasPaymentMethod) {
    if (!props.isWorkspaceAdmin) {
      return null;
    }
    return <TrialingBannerNoCTA trialEnd={props.subscriptionTrialEnd} />;
  }

  // When past_due, use checkoutSession with SETUP
  if (props.subscriptionStatus === "past_due" && !hasPaymentMethod) {
    if (!props.isWorkspaceAdmin) {
      return <AccountInactiveNonAdminBannerNoCTA />;
    }

    return (
      <PastDueBannerCheckoutCTA
        workspaceId={props.workspaceId}
        status={props.subscriptionStatus}
      />
    );
  }

  // When canceled, use checkoutSession with SETUP
  if (props.subscriptionStatus === "canceled") {
    if (!props.isWorkspaceAdmin) {
      return <AccountInactiveNonAdminBannerNoCTA />;
    }

    return (
      <CanceledBannerCheckoutCTA
        workspaceId={props.workspaceId}
        status={props.subscriptionStatus}
      />
    );
  }

  return null;
}

function TrialingBannerCheckoutCTA({
  workspaceId,
  status
}: {
  workspaceId: string;
  status: StripeSubscriptionStatus;
}) {
  return (
    <div className="flex justify-between items-center text-blue my-2 p-4 bg-white border shadow flex-wrap">
      <div className="flex flex-wrap items-center">
        <div className="pl-2">
          <p className="font-black">Upgrade to PRO</p>
          <p className="text-sm">
            Your account is in trial mode. Upgrade to PRO to keep leveling up your team.
          </p>
        </div>
      </div>
      <ButtonCheckoutSession workspaceId={workspaceId} subscriptionStatus={status} />
    </div>
  );
}

const TrialingBannerNoCTA: React.FC<{ trialEnd: number }> = ({ trialEnd }) => {
  return (
    <div className="flex justify-between items-center text-blue my-2 p-4 bg-white border shadow flex-wrap">
      <div className="flex flex-wrap items-center">
        <div className="pl-2">
          <p className="font-black">Trialing</p>
          <p className="text-sm">
            Your free trial ends {moment.unix(trialEnd).fromNow()}. Once it ends, you will
            be billed automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

const AccountInactiveNonAdminBannerNoCTA = () => {
  return (
    <div className="flex justify-between items-center text-blue my-2 p-4 bg-red text-white border shadow shadow-red flex-wrap">
      <div className="flex flex-wrap items-center">
        <div className="pl-2">
          <p className="font-black">Your team's account is inactive</p>
          <p className="text-sm mb-2 md:mb-0">
            Please ask a workspace admin to upgrade your account
          </p>
        </div>
      </div>
    </div>
  );
};

const PastDueBannerCheckoutCTA = ({
  workspaceId,
  status
}: {
  workspaceId: string;
  status: Props["subscriptionStatus"];
}) => {
  return (
    <div className="flex justify-between items-center text-blue my-2 p-4 bg-red text-white border shadow shadow-red flex-wrap">
      <div className="flex flex-wrap items-center">
        <div className="pl-2">
          <p className="font-black">Past due</p>
          <p className="text-sm mb-2 md:mb-0">
            You can still read all of your existing data, but you need to update your
            payment method to create new retros.
          </p>
        </div>
      </div>
      <ButtonCheckoutSession workspaceId={workspaceId} subscriptionStatus={status} />
    </div>
  );
};

const CanceledBannerCheckoutCTA = ({
  workspaceId,
  status
}: {
  workspaceId: string;
  status: Props["subscriptionStatus"];
}) => {
  return (
    <div className="flex justify-between items-center text-blue my-2 p-4 bg-red text-white border shadow shadow-red flex-wrap">
      <div className="flex flex-wrap items-center">
        <div className="pl-2">
          <p className="font-black">Canceled</p>
          <p className="text-sm mb-2 md:mb-0">
            You can still read all of your existing data, but you'll have to upgrade your
            account to create new retros.
          </p>
        </div>
      </div>
      <ButtonCheckoutSession workspaceId={workspaceId} subscriptionStatus={status} />
    </div>
  );
};
