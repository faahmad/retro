import * as functions from "firebase-functions";
import {
  getUserIdFromIdToken,
  getWorkspaceUsers
} from "../../../services/firebase-admin";
import { cors } from "../../../lib/cors";
import { logger } from "../../../lib/logger";
