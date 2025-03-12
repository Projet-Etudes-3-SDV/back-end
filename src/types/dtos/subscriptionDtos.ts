import { IsString, IsDate, IsEnum, IsBoolean } from "class-validator";
import { Expose } from "class-transformer";
import { SubscriptionPlan, SubscriptionStatus } from "../../models/user.model";

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

export class SubscriptionPresenter {
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
}