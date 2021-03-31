import { axios } from "../lib/axios";

export function getBaseURL() {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:5001/retro-dev-786/us-central1"
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

export function getStripeSubscriptionStatus(workspaceId: string) {
  return axios.post(getBaseURL() + "/getStripeSubscriptionStatus", { workspaceId });
}
