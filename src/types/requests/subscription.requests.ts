import { IsString, IsEnum, IsBoolean, IsOptional, IsDate } from "class-validator";
import { SubscriptionPlan } from "../../models/subscription.model";
import { Expose } from "class-transformer";

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

export class CancelSubscription {
  @IsString()
  @Expose()
  subscriptionId!: string;
}
