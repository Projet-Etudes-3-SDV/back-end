import { IsString, IsEnum, IsBoolean, IsDate, IsNumber } from "class-validator";
import { SubscriptionPlan, SubscriptionStatus } from "../../models/subscription.model";
import { Expose } from "class-transformer";

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
