import { Request, Response, NextFunction } from "express";
import { SubscriptionService } from "../services/subscription.service";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { SubscriptionDto, SubscriptionPresenter, SubscriptionToCreate } from "../types/dtos/subscriptionDtos";
import { AppError } from "../utils/AppError";

export class SubscriptionController {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  async getSubscriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subscriptions = await this.subscriptionService.getSubscriptions();
      const subscriptionPresenter = subscriptions?.map(subscription => plainToClass(SubscriptionPresenter, subscription, { excludeExtraneousValues: true }));
      res.status(200).json(subscriptionPresenter);
    }
    catch (error) {
      next(error);
    }
  }

  async getSubscriptionBy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query;
      const subscriptions = await this.subscriptionService.getSubscriptionBy(filters);
      const subscriptionPresenter = subscriptions?.map(subscription => plainToClass(SubscriptionPresenter, subscription, { excludeExtraneousValues: true }));
      res.status(200).json(subscriptionPresenter);
    }
    catch (error) {
      next(error);
    }
  }

  async addSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subscriptionData = req.body;
      const subscriptionDto = plainToClass(SubscriptionToCreate, subscriptionData);
      const dtoErrors = await validate(subscriptionDto);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const subscription = await this.subscriptionService.addSubscription(subscriptionDto);
      const subscriptionPresenter = plainToClass(SubscriptionPresenter, subscription, { excludeExtraneousValues: true });
      res.status(201).json(subscriptionPresenter);
    } catch (error) {
      next(error);
    }
  }

  async patchSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subscriptionId } = req.query;
      const subscriptionData = req.body;
      const subscriptionDto = plainToClass(SubscriptionDto, subscriptionData);
      const dtoErrors = await validate(subscriptionDto);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const subscription = await this.subscriptionService.patchSubscription(subscriptionId as string, subscriptionDto);
      const subscriptionPresenter = plainToClass(SubscriptionPresenter, subscription, { excludeExtraneousValues: true });
      res.status(200).json(subscription);
    }
    catch (error) { 
      next(error);
    }
  }

  async cancelSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.body;
      if (!userId) {
        throw new AppError("Validation failed", 400, [{ field: "userId", constraints: ["userId should not be empty"] }]);
      }
      const user = await this.subscriptionService.cancelSubscription(userId);
      const subscriptionPresenter = plainToClass(SubscriptionPresenter, user, { excludeExtraneousValues: true });
      if (user) {
        res.status(200).json(subscriptionPresenter);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subscriptionId } = req.query;
      if (!subscriptionId) {
        throw new AppError("Validation failed", 400, [{ field: "subscriptionId", constraints: ["subscriptionId should not be empty"] }]);
      }
      const result = await this.subscriptionService.deleteSubscription(subscriptionId as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
