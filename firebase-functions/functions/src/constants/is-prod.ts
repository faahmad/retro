import { projectIds } from "./project-ids";

export const isProd = process.env.GCLOUD_PROJECT === projectIds.prod;
