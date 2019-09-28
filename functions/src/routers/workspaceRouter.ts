import * as express from "express";
const workspaceRouter = express.Router();
import { workspaceController } from "../controllers/workspaceController";

workspaceRouter
  .route("/workspaces/:workspaceId/plan")
  .patch(workspaceController.subscribeWorkspaceToStandardPlan);

export { workspaceRouter };
