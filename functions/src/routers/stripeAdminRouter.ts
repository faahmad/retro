import * as express from "express";
const stripeAdminRouter = express.Router();
import { stripeAdminController } from "../controllers/stripeAdminController";

stripeAdminRouter
  .route("/stripe-admin/products")
  .post(stripeAdminController.createProduct);

stripeAdminRouter
  .route("/stripe-admin/plans")
  .post(stripeAdminController.createPlan);

export { stripeAdminRouter };
