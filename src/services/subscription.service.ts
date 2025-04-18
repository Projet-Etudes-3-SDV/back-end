import { UserRepository } from "../repositories/user.repository";
import { ISubscription, SubscriptionStatus } from "../models/subscription.model";
import { SubscriptionRepository } from "../repositories/subscription.repository";
import { AppError } from "../utils/AppError";
import { ProductRepository } from "../repositories/product.repository";
import { SearchSubscriptionCriteria, SubscriptionToCreate, SubscriptionToModify } from "../types/dtos/subscriptionDtos";

export class SubscriptionService {
  private userRepository: UserRepository;
  private subscriptionRepository: SubscriptionRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.subscriptionRepository = new SubscriptionRepository();
    this.productRepository = new ProductRepository();
  }

  async getSubscriptions(): Promise<ISubscription[]> {
    return await this.subscriptionRepository.findAll();
  }

  async getSubscriptionBy(filters: SearchSubscriptionCriteria): Promise<ISubscription[] | null> {
    return await this.subscriptionRepository.findBy(filters);
  }

  async addSubscription(subscriptionData: SubscriptionToCreate): Promise<ISubscription> {
    const user = await this.userRepository.findOneBy({ id: subscriptionData.user });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const product = await this.productRepository.findOneBy({ id: subscriptionData.product });
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (user.subscriptions.find(sub => sub.product.id === product.id)) {
      throw new AppError("User already subscribed to this product", 400);
    }

    const newSub = await this.subscriptionRepository.create({ user: user._id, product: product._id, plan: subscriptionData.plan })

    user.subscriptions.push(newSub._id);

    await this.userRepository.update(user.id, user);
  
    return newSub;
  }

  async cancelSubscription(subscriptionId: string): Promise<ISubscription | null> {
    const subscription = await this.subscriptionRepository.findById(subscriptionId);
     if (!subscription) {
      throw new AppError("Subscription not found", 404);
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.autoRenew = false;

    return await this.subscriptionRepository.update(subscriptionId, subscription);
  }

  async patchSubscription(subscriptionId: string, subscriptionData: SubscriptionToModify){
    const subscription = this.subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new AppError("Subscription not found", 404);
    }

    return await this.subscriptionRepository.update(subscriptionId, subscriptionData)
  }

  async deleteSubscription(subscriptionId: string) {
    const subscription = await this.subscriptionRepository.findById(subscriptionId);
     if (!subscription) {
      throw new AppError("Subscription not found", 404);
    }

    const user = await this.userRepository.findOneBy({ id: subscription.user.id });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const result = await this.subscriptionRepository.delete(subscriptionId);

    if (!result) {
      throw new AppError("Subscription deletion failed", 500); 
    }

    user.subscriptions = user.subscriptions.filter((sub) => sub.id !== subscriptionId);
    await this.userRepository.update(user.id, user);
  }
}
