import { axios } from "../lib/axios";

const baseUrl = process.env.REACT_APP_FIREBASE_CLOUD_FUNCTIONS_URL;

interface CreateStripeBillingPortalSessionParams {
  workspaceId: string;
  returnUrl: string;
}
export function createStripeBillingPortalSession(
  params: CreateStripeBillingPortalSessionParams
) {
  return axios.post(baseUrl + "/createStripeBillingPortalSession", params);
}

export function getStripeSubscriptionStatus(workspaceId: string) {
  return axios.post(baseUrl + "/getStripeSubscriptionStatus", { workspaceId });
}
