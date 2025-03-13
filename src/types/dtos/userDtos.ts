import { IsString, IsNumber, Min, Max, IsOptional, ValidateNested, IsArray, IsBoolean, IsDate } from "class-validator";
import { Expose, Type } from "class-transformer";
import "reflect-metadata";
import { CartItemPresenter } from "./cartDtos";
import { SubscriptionPresenter } from "./subscriptionDtos";

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
  subscriptionsPlan?: "monthly" | "yearly" | "free-trial";

  @IsDate()
  @IsOptional()
  @Expose()
  subscriptionsStartDate?: Date;

  @IsDate()
  @IsOptional()
  @Expose()
  subscriptionsEndDate?: Date;

  @IsString()
  @IsOptional()
  @Expose()
  subscriptionsStatus?: "active" | "cancelled" | "expired" | "trial";

  @IsBoolean()
  @IsOptional()
  @Expose()
  subscriptionsAutoRenew?: boolean;
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
  subscriptionsPlan?: "monthly" | "yearly" | "free-trial";

  @IsDate()
  @IsOptional()
  @Expose()
  subscriptionsStartDate?: Date;

  @IsDate()
  @IsOptional()
  @Expose()
  subscriptionsEndDate?: Date;

  @IsString()
  @IsOptional()
  @Expose()
  subscriptionsStatus?: "active" | "cancelled" | "expired" | "trial";

  @IsBoolean()
  @IsOptional()
  @Expose()
  subscriptionsAutoRenew?: boolean;
}

export class SearchUserCriteria {
  @IsString()
  @IsOptional()
  @Expose()
  id?: string;

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

export class UserLogin {
  @IsString()
  @Expose()
  email!: string;

  @IsString()
  @Expose()
  password!: string;
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
  @ValidateNested({ each: true })
  @Type(() => SubscriptionPresenter)
  subscriptions!: SubscriptionPresenter;

  // @Expose()
  // @ValidateNested({ each: true })
  // @Type(() => AddressPresenter)
  // addresses?: AddressPresenter;
}

export class UserCreationPresenter {
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
}

export class AdminUserPresenter {
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
  @Type(() => SubscriptionPresenter)
  subscriptions?: SubscriptionPresenter;

  @Expose()
  password!: string;

  @Expose()
  resetPasswordToken?: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}