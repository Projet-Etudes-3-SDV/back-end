import { Request, Response, NextFunction } from "express";
import { SubscriptionService } from "../services/subscription.service";
import { SubscriptionPlan } from "../models/user.model";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { SubscriptionDto } from "../types/dtos/subscriptionDtos";
import { AppError } from "../utils/AppError";

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

  async cancelSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.body;
      if (!userId) {
        throw new AppError("Validation failed", 400, [{ field: "userId", constraints: ["userId should not be empty"] }]);
      }
      const user = await this.subscriptionService.cancelSubscription(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  async updateSubscriptionEndDate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, newEndDate } = req.body;
      if (!userId || !newEndDate) {
        throw new AppError("Validation failed", 400, [{ field: "userId", constraints: ["userId should not be empty"] }, { field: "newEndDate", constraints: ["newEndDate should not be empty"] }]);
      }
      const user = await this.subscriptionService.updateSubscriptionEndDate(userId, new Date(newEndDate));
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  async isSubscriptionActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new AppError("Validation failed", 400, [{ field: "userId", constraints: ["userId should not be empty"] }]);
      }
      const isActive = await this.subscriptionService.isSubscriptionActive(userId);
      res.status(200).json({ isActive });
    } catch (error) {
      next(error);
    }
  }
}
