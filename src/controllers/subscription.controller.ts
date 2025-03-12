import { Request, Response } from "express";
import { SubscriptionService } from "../services/subscription.service";
import { SubscriptionPlan } from "../models/user.model";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { SubscriptionDto } from "../types/dtos/subscriptionDtos";

export class SubscriptionController {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  async activateSubscription(req: Request, res: Response): Promise<void> {
    const subscriptionDto = plainToClass(SubscriptionDto, req.body);
    const errors = await validate(subscriptionDto);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    const { userId, plan, endDate } = req.body;
    const user = await this.subscriptionService.activateSubscription(userId, plan as SubscriptionPlan, new Date(endDate));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }

  async cancelSubscription(req: Request, res: Response): Promise<void> {
    const { userId } = req.body;
    const user = await this.subscriptionService.cancelSubscription(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }

  async updateSubscriptionEndDate(req: Request, res: Response): Promise<void> {
    const { userId, newEndDate } = req.body;
    const user = await this.subscriptionService.updateSubscriptionEndDate(userId, new Date(newEndDate));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }

  async isSubscriptionActive(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const isActive = await this.subscriptionService.isSubscriptionActive(userId);
    res.status(200).json({ isActive });
  }
}
