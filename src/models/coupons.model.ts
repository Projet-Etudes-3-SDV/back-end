import Stripe from "stripe";

export interface ISubscriptionCoupon {
  name: string;
  reduction: number;
  reductionType: 'percentage' | 'fixed';
  startDate: Date;
  endDate?: Date;
}

export enum SubscriptionDuration {
  FOREVER = "forever",
  ONCE = "once",
  REPEATING = "repeating"
}

export interface IAdminSubscriptionCoupon extends ISubscriptionCoupon {
  code: string;
  promotionCodeId: string;
  couponId: string;
  duration: Stripe.Coupon.Duration;
  durationInMonths?: number | undefined | null;
  isActive: boolean;
  timesReedeemed: number;
}