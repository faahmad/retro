import { Response } from "express";
import { stripeService } from "../lib/stripeService";
import { workspaceService } from "../services/workspaceService";

export const workspaceController = {
  subscribeWorkspaceToStandardPlan: async (req: any, res: Response) => {
    const { workspaceId } = req.params;
    const { user } = req;

    const workspace = await workspaceService.findWorkspaceById(workspaceId);

    if (!workspace) {
      // It returns an error if the requested workspace doesn't exist.
      res.status(404).json({ error: "Not found" });
      return;
    }

    if (workspace.users[user.uid] !== "owner") {
      // It returns an error if the user making the request is not a workspace owner.
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      // It creates a new stripe customer.
      const customer = await stripeService.createCustomer(user.email);
      // It subscribes the customer to the standard plan.
      const subscription = await stripeService.subscribeCustomerToStandardPlan(
        customer.id
      );
      // It adds a document to the workspaceSubscriptions collection.
      const newWorkspaceSubscription: RetroWorkspaceSubscription = {
        createdBy: user.uid,
        customerId: customer.id,
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        trialEnd: subscription.trial_end
      };
      await workspaceService.updateWorkspacePlan(
        workspaceId,
        newWorkspaceSubscription
      );
      // It returns the newly created workspace subscription.
      res.status(201).json({ workspaceSubscription: newWorkspaceSubscription });
      return;
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
