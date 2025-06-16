import { ISubscriptionCoupon } from "./coupons.model";

export enum SubscriptionPlan {
  MONTHLY = "monthly",
  YEARLY = "yearly",
  FREE_TRIAL = "free-trial",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  TRIAL = "trial",
}

export interface IUserSubscription {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'trialing';
  planType: 'monthly' | 'yearly';
  coupon?: ISubscriptionCoupon;
  cancelAtPeriodEnd: boolean;
  productId: string;
  createdAt: Date;
}