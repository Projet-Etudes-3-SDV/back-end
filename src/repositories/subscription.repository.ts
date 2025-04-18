import { FilterQuery } from "mongoose";
import Subscription, { type ISubscription } from "../models/subscription.model";
import { SearchSubscriptionCriteria } from "../types/dtos/subscriptionDtos";

export class SubscriptionRepository {
  async create(subscriptionData: Partial<ISubscription>): Promise<ISubscription> {
    const subscription = new Subscription(subscriptionData);
    return await subscription.save();
  }

  async findAll(): Promise<ISubscription[]> {
    return await Subscription.find().populate("user").populate({ path: "product", populate: { path: "category" } });
  }

  async findBy(filters: FilterQuery<SearchSubscriptionCriteria>): Promise<ISubscription[] | null> {
    const query: FilterQuery<SearchSubscriptionCriteria> = {};
    if (filters.user) query.name = filters.user;
    if (filters.product) query.product = filters.product;
    if (filters.plan) query.plan = filters.plan;
    if (filters.status) query.status = filters.status;
    if (filters.autoRenew) query.autoRenew = filters.autoRenew;
    

    return await Subscription.find(query).populate("user").populate({ path: "product", populate: { path: "category" } });
  }

  async findById(id: string): Promise<ISubscription | null> {
    return await Subscription.findOne({ id }).populate("user").populate({ path: "product", populate: { path: "category" } });
  }

  async findByUserId(userId: string): Promise<ISubscription | null> {
    return await Subscription.findOne({ user: userId }).populate("user").populate({ path: "product", populate: { path: "category" } });
  }

  async update(id: string, subscriptionData: Partial<ISubscription>): Promise<ISubscription | null> {
    return await Subscription.findOneAndUpdate({ id }, subscriptionData, { new: true }).populate("user").populate({ path: "product", populate: { path: "category" } });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Subscription.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
