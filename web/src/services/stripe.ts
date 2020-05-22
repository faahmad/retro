import { axios } from "../lib/axios";

interface CreateStripeBillingPortalSessionParams {
  workspaceId: string;
  returnUrl: string;
}
export function createStripeBillingPortalSession(
  params: CreateStripeBillingPortalSessionParams
) {
  const baseUrl = process.env.REACT_APP_FIREBASE_CLOUD_FUNCTIONS_URL;
  return axios.post(baseUrl + "/createStripeBillingPortalSession", params);
}
