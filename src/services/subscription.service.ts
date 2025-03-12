import { UserRepository } from "../repositories/user.repository";
import { IUser, SubscriptionPlan, SubscriptionStatus } from "../models/user.model";

export class SubscriptionService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async activateSubscription(userId: string, plan: SubscriptionPlan, endDate: Date): Promise<IUser | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;

    user.subscription.plan = plan;
    user.subscription.startDate = new Date();
    user.subscription.endDate = endDate;
    user.subscription.status = SubscriptionStatus.ACTIVE;
    user.subscription.autoRenew = true;

    return await this.userRepository.update(userId, user);
  }

  async cancelSubscription(userId: string): Promise<IUser | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;

    user.subscription.status = SubscriptionStatus.CANCELLED;
    user.subscription.autoRenew = false;

    return await this.userRepository.update(userId, user);
  }

  async updateSubscriptionEndDate(userId: string, newEndDate: Date): Promise<IUser | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;

    user.subscription.endDate = newEndDate;
    user.subscription.status = SubscriptionStatus.ACTIVE;

    return await this.userRepository.update(userId, user);
  }

  async isSubscriptionActive(userId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) return false;

    return user.isSubscriptionActive();
  }
}
