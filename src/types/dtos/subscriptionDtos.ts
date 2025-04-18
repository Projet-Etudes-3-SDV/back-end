import { IsString, IsDate, IsEnum, IsBoolean, IsOptional } from "class-validator";
import { Expose, Type } from "class-transformer";
import { SubscriptionPlan, SubscriptionStatus } from "../../models/subscription.model";
import { ProductPresenter } from "./productDtos";

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
}

export class SubscriptionPresenter {
  @IsString()
  @Expose()
  id!: string;

  @IsString()
  @Expose()
  plan!: SubscriptionPlan;

  @IsDate()
  @Expose()
  startDate!: Date;

  @IsDate()
  @Expose()
  endDate!: Date;

  @IsString()
  @Expose()
  status!: SubscriptionStatus;

  @IsBoolean()
  @Expose()
  autoRenew!: boolean;

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
