import { axios } from "../lib/axios";

export function getBaseURL() {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:5001/retro-prod-786/us-central1"
    : process.env.REACT_APP_FIREBASE_CLOUD_FUNCTIONS_URL;
}

interface CreateStripeBillingPortalSessionParams {
  workspaceId: string;
  returnUrl: string;
}
export function createStripeBillingPortalSession(
  params: CreateStripeBillingPortalSessionParams
) {
  return axios.post(getBaseURL() + "/createStripeBillingPortalSession", params);
}
interface CreateStripeCheckoutSessionParams {
  workspaceId: string;
  returnUrl: string;
  mode: "setup" | "subscription";
}
export function createStripeCheckoutSession(params: CreateStripeCheckoutSessionParams) {
  return axios.post(getBaseURL() + "/createCheckoutSession", params);
}

export function getStripeSubscription(workspaceId: string) {
  return axios.post(getBaseURL() + "/getStripeSubscription", { workspaceId });
}
