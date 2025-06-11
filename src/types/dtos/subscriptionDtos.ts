import { IsString, IsDate, IsEnum, IsBoolean, IsOptional, IsNumber } from "class-validator";
import { Expose, Type } from "class-transformer";
import { SubscriptionPlan, SubscriptionStatus } from "../../models/subscription.model";
import { ProductPresenter } from "./productDtos";
import { CouponPresenter, ISubscriptionCoupon } from "./couponDtos";

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
}

export class SubscriptionToCreate {
  @IsString()
  @IsEnum(SubscriptionPlan)
  @Expose()
  plan!: SubscriptionPlan;

  @IsBoolean()
  @Expose()
  @IsOptional()
  autoRenew?: boolean = true;

  @IsString()
  @Expose()
  user!: string;

  @IsString()
  @Expose()
  product!: string;
}

export class SubscriptionDto {
  @IsString()
  @IsEnum(SubscriptionPlan)
  @Expose()
  plan!: SubscriptionPlan;

  @IsDate()
  @Expose()
  startDate!: Date;

  @IsDate()
  @Expose()
  endDate!: Date;

  @IsString()
  @IsEnum(SubscriptionStatus)
  @Expose()
  status!: SubscriptionStatus;

  @IsBoolean()
  @Expose()
  autoRenew!: boolean;
}

export class CancelSubscription {
  @IsString()
  @Expose()
  subscriptionId!: string;
}

export class SearchSubscriptionCriteria {
  @IsString()
  @Expose()
  user?: string;

  @IsString()
  @Expose()
  product?: string;

  @IsEnum(SubscriptionPlan)
  @Expose()
  plan?: SubscriptionPlan;

  @IsEnum(SubscriptionStatus)
  @Expose()
  status?: SubscriptionStatus;

  @IsBoolean()
  @Expose()
  autoRenew?: boolean;

  @IsDate()
  @Expose()
  endDate?: Date;

  @IsDate()
  @Expose()
  startDate?: Date;

  @IsNumber()
  @Expose()
  page?: number;

  @IsNumber()
  @Expose()
  limit?: number;
}

export class SubscriptionPresenter {
  @IsString()
  @Expose()
  id!: string;

  @IsString()
  @Expose()
  name!: string;

  @IsString()
  @Expose()
  description!: string;

  @IsNumber()
  @Expose()
  price!: number; // Prix en centimes

  @IsString()
  @Expose()
  currency!: string;

  @IsDate()
  @Expose()
  startDate!: Date;

  @IsDate()
  @Expose()
  endDate!: Date;

  @IsString()
  @Expose()
  status!: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'trialing';

  @IsString()
  @Expose()
  planType!: 'monthly' | 'yearly';

  @Expose()
  @Type(() => CouponPresenter)
  coupon?: CouponPresenter;

  @IsBoolean()
  @Expose()
  cancelAtPeriodEnd!: boolean;

  @Expose()
  @Type(() => ProductPresenter)
  product!: ProductPresenter;
}

export class SubscriptionToModify {
  @IsString()
  @IsEnum(SubscriptionPlan)
  @Expose()
  plan!: SubscriptionPlan;

  @IsBoolean()
  @Expose()
  autoRenew?: boolean;

  @IsDate()
  @Expose()
  endDate?: Date;
}
