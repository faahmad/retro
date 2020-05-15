import { axios } from "../lib/axios";

interface CreateStripeCheckoutSessionParams {
  workspaceId: string;
  successUrl: string;
  cancelUrl: string;
}
export function createStripeCheckoutSession(
  params: CreateStripeCheckoutSessionParams
) {
  const baseUrl = process.env.REACT_APP_FIREBASE_CLOUD_FUNCTIONS_URL;
  return axios.post(baseUrl + "/createStripeCheckoutSession", params  );
}
