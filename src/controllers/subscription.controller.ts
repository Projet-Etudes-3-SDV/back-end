import { Request, Response, NextFunction } from "express";
import { SubscriptionService } from "../services/subscription.service";
import { plainToClass } from "class-transformer";
import { SubscriptionPresenter } from "../types/dtos/subscriptionDtos";
import { AppError } from "../utils/AppError";
import { EncodedRequest } from "../utils/EncodedRequest";
import { UserRepository } from "../repositories/user.repository";
import { UserNotFound } from "../types/errors/user.errors";

export class SubscriptionController {
  private subscriptionService: SubscriptionService;
  private userRepository: UserRepository;

  constructor() {
    this.subscriptionService = new SubscriptionService();
    this.userRepository = new  UserRepository();
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

  async getSubscriptionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const subscription = await this.subscriptionService.getSubscriptionById(id);
      const subscriptionPresenter = plainToClass(SubscriptionPresenter, subscription, { excludeExtraneousValues: true });
      res.status(200).json(subscriptionPresenter);
    }
    catch (error) {
      next(error);
    }
  }

  async getUserSubscriptions(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.decoded.user.id;
      if (!userId) {
        throw new AppError("Validation failed", 400, [{ field: "userId", constraints: ["userId should not be empty"] }]);
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new UserNotFound()
      }
      if (!user.stripeCustomerId) {
        res.status(200).json([]);
        return
      }

      const subscriptions = await this.subscriptionService.getUserSubscription(user.stripeCustomerId);
      const subscriptionPresenter = subscriptions?.map(subscription => plainToClass(SubscriptionPresenter, subscription, { excludeExtraneousValues: true }));
      res.status(200).json(subscriptionPresenter);
    } catch (error) {
      next(error);
    }
  }

  async cancelSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subscriptionId = req.params.subscriptionId;

      if (!subscriptionId) {
        throw new AppError("Validation failed", 400, [{ field: "subscriptionId", constraints: ["subscriptionId should not be empty"] }]);
      }

      const user = await this.subscriptionService.cancelSubscription(subscriptionId);
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
}
