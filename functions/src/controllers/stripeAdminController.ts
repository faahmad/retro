import { Request, Response } from "express";
import { stripeService } from "../lib/stripeService";

export const stripeAdminController = {
  createProduct: async (req: Request, res: Response) => {
    const { name, type } = req.body;
    if (!name || !type) {
      res.status(401).json({ error: "Bad Request" });
      return;
    }
    try {
      const product = await stripeService.createProduct(name, type);
      res.status(201).json(product);
      return;
    } catch (error) {
      res.status(500).json({ error: error.message });
      return;
    }
  },
  createPlan: async (req: Request, res: Response) => {
    const { name, amount } = req.body;
    if (!name || !amount) {
      res.status(401).json({ error: "Bad Request" });
      return;
    }
    try {
      const plan = await stripeService.createPlan(name, amount);
      res.status(201).json(plan);
      return;
    } catch (error) {
      res.status(500).json({ error: error.message });
      return;
    }
  }
};
