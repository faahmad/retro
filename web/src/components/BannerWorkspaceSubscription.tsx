import * as React from "react";
import * as moment from "moment";
import { StripeSubscriptionStatus } from "../types/stripe-subscription-status";
import { ButtonCheckoutSession } from "./ButtonCheckoutSession";
import { ButtonBillingPortalSession } from "./ButtonBillingPortalSession";
import { Workspace } from "../types/workspace";

interface Props {
  workspaceId: string;
  isWorkspaceAdmin: boolean;
  subscriptionTrialEnd: number;
  subscriptionStatus: StripeSubscriptionStatus;
  paymentMethodId: string | null | undefined;
}

export function BannerWorkspaceSubscription({
  workspaceId,
  isWorkspaceAdmin,
  subscriptionTrialEnd,
  subscriptionStatus,
  paymentMethodId
}: Props) {
  const hasPaymentMethod = Boolean(paymentMethodId);

  // The team has not attached a payment method, so we want them to add one.
  if (subscriptionStatus === "trialing" && !hasPaymentMethod) {
    return (
      <TrialingUpgradeBanner
        workspaceId={workspaceId}
        isWorkspaceAdmin={isWorkspaceAdmin}
      />
    );
  }

  // The team has attached a payment method, so there are no actions to take.
  if (subscriptionStatus === "trialing" && hasPaymentMethod) {
    return (
      <TrialingInfoBanner
        workspaceId={workspaceId}
        isWorkspaceAdmin={isWorkspaceAdmin}
        trialEnd={subscriptionTrialEnd}
      />
    );
  }

  // The team's subscription bill is past due, so we want them to update their payment method.
  if (subscriptionStatus === "past_due") {
    return (
      <PastDueBanner workspaceId={workspaceId} isWorkspaceAdmin={isWorkspaceAdmin} />
    );
  }

  // When canceled, use checkoutSession with SETUP
  if (subscriptionStatus === "canceled") {
    return (
      <CanceledBanner workspaceId={workspaceId} isWorkspaceAdmin={isWorkspaceAdmin} />
    );
  }

  // The team's workspace is active, so there is nothing to show.
  return null;
}

enum BannerVariant {
  DEFAULT = "default",
  ERROR = "error"
}
interface BannerProps {
  variant: BannerVariant;
  label: string;
  description: string;
  children?: React.ReactNode;
}
function Banner(props: BannerProps) {
  const variantStylesMap: { [key in BannerVariant]: string } = {
    [BannerVariant.DEFAULT]: "bg-white text-blue shadow-blue",
    [BannerVariant.ERROR]: "bg-red text-white shadow-red"
  };
  const variantStyles = variantStylesMap[props.variant];

  return (
    <div
      className={`flex flex-wrap justify-between items-center my-2 p-4 border ${variantStyles}`}
    >
      <div className="flex flex-wrap items-center">
        <div className="pl-2">
          <p className="font-black">{props.label}</p>
          <p className="text-sm mb-2 md:mb-0">{props.description}</p>
        </div>
      </div>
      {props.children || null}
    </div>
  );
}

function TrialingUpgradeBanner({
  workspaceId,
  isWorkspaceAdmin
}: {
  workspaceId: Workspace["id"];
  isWorkspaceAdmin: boolean;
}) {
  if (!isWorkspaceAdmin) {
    return (
      <Banner
        variant={BannerVariant.DEFAULT}
        label="Trialing"
        description="Your team's account is in trial mode. Ask an admin to upgrade your account to keep leveling up."
      />
    );
  }

  return (
    <Banner
      variant={BannerVariant.DEFAULT}
      label="Trialing"
      description="Your account is in trial mode. Add a payment method to keep leveling up your team."
    >
      <ButtonBillingPortalSession workspaceId={workspaceId} />
    </Banner>
  );
}

function TrialingInfoBanner({
  workspaceId,
  isWorkspaceAdmin,
  trialEnd
}: {
  workspaceId: Workspace["id"];
  isWorkspaceAdmin: boolean;
  trialEnd: number;
}) {
  if (!isWorkspaceAdmin) {
    return null;
  }

  const trialEndFromNow = moment.unix(trialEnd).fromNow();
  return (
    <Banner
      variant={BannerVariant.DEFAULT}
      label="Trialing"
      description={`Your free trial ends ${trialEndFromNow}. Once it ends, you will be billed automatically.`}
    >
      <ButtonBillingPortalSession workspaceId={workspaceId} />
    </Banner>
  );
}

function InactiveInfoBanner() {
  return (
    <Banner
      variant={BannerVariant.ERROR}
      label="Your team's account is inactive"
      description="You can still read all of your existing data. Ask an admin to make a payment to create new retros."
    />
  );
}

function PastDueBanner({
  workspaceId,
  isWorkspaceAdmin
}: {
  workspaceId: Workspace["id"];
  isWorkspaceAdmin: boolean;
}) {
  if (!isWorkspaceAdmin) {
    return <InactiveInfoBanner />;
  }
  return (
    <Banner
      variant={BannerVariant.ERROR}
      label="Past due"
      description="You can still read all of your existing data, but you need to update your payment method to create new retros."
    >
      <ButtonBillingPortalSession workspaceId={workspaceId} />
    </Banner>
  );
}

function CanceledBanner({
  workspaceId,
  isWorkspaceAdmin
}: {
  workspaceId: Workspace["id"];
  isWorkspaceAdmin: boolean;
}) {
  if (!isWorkspaceAdmin) {
    return <InactiveInfoBanner />;
  }
  return (
    <Banner
      variant={BannerVariant.ERROR}
      label="Canceled"
      description="You can still read all of your existing data, but you need to upgrade your account to create new retros."
    >
      <ButtonCheckoutSession workspaceId={workspaceId} />
    </Banner>
  );
}
