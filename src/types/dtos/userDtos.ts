import { IsString, IsNumber, Min, Max, IsOptional, ValidateNested, IsArray, IsBoolean, IsDate } from "class-validator";
import { Expose, Transform, Type } from "class-transformer";
import "reflect-metadata";
import { CartItemPresenter } from "./cartDtos";

export class UserToCreate {
  @IsString()
  @Expose()
  lastName!: string;

  @IsString()
  @Expose()
  firstName!: string;

  @IsString()
  @Expose()
  email!: string;

  @IsString()
  @Expose()
  password!: string;

  @IsString()
  @IsOptional()
  @Expose()
  phone?: string;

  @IsString()
  @IsOptional()
  @Expose()
  subscriptionPlan?: "monthly" | "yearly" | "free-trial";

  @IsDate()
  @IsOptional()
  @Expose()
  subscriptionStartDate?: Date;

  @IsDate()
  @IsOptional()
  @Expose()
  subscriptionEndDate?: Date;

  @IsString()
  @IsOptional()
  @Expose()
  subscriptionStatus?: "active" | "cancelled" | "expired" | "trial";

  @IsBoolean()
  @IsOptional()
  @Expose()
  subscriptionAutoRenew?: boolean;
}

export class UserToModify {
  @IsString()
  @IsOptional()
  @Expose()
  lastName?: string;

  @IsString()
  @IsOptional()
  @Expose()
  firstName?: string;

  @IsString()
  @IsOptional()
  @Expose()
  email?: string;

  @IsString()
  @IsOptional()
  @Expose()
  password?: string;

  @IsString()
  @IsOptional()
  @Expose()
  phone?: string;

  @IsString()
  @IsOptional()
  @Expose()
  subscriptionPlan?: "monthly" | "yearly" | "free-trial";

  @IsDate()
  @IsOptional()
  @Expose()
  subscriptionStartDate?: Date;

  @IsDate()
  @IsOptional()
  @Expose()
  subscriptionEndDate?: Date;

  @IsString()
  @IsOptional()
  @Expose()
  subscriptionStatus?: "active" | "cancelled" | "expired" | "trial";

  @IsBoolean()
  @IsOptional()
  @Expose()
  subscriptionAutoRenew?: boolean;
}

export class SearchUserCriteria {
  @IsString()
  @IsOptional()
  @Expose()
  lastName?: string;

  @IsString()
  @IsOptional()
  @Expose()
  firstName?: string;

  @IsString()
  @IsOptional()
  @Expose()
  email?: string;

  @IsString()
  @IsOptional()
  @Expose()
  resetPasswordToken?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @Expose()
  page: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @Expose()
  limit: number = 10;
}

export class UserToReplace extends UserToCreate {}

export class UserPresenter {
  @Expose()
  id!: string;

  @Expose()
  lastName!: string;

  @Expose()
  firstName!: string;

  @Expose()
  email!: string;

  @Expose()
  phone?: string;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemPresenter)
  cart?: CartItemPresenter;

  @Expose()
  subscriptionPlan!: "monthly" | "yearly" | "free-trial";

  @Expose()
  subscriptionStartDate!: Date;

  @Expose()
  subscriptionEndDate!: Date;

  @Expose()
  subscriptionStatus!: "active" | "cancelled" | "expired" | "trial";

  @Expose()
  subscriptionAutoRenew!: boolean;
}
