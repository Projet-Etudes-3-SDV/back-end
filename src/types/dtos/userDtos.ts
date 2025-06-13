import { IsString, IsNumber, Min, Max, IsOptional, ValidateNested, IsArray, IsBoolean, IsDate, Matches, IsEnum, IsIn } from "class-validator";
import { Expose, Type } from "class-transformer";
import "reflect-metadata";
import { CartItemPresenter } from "./cartDtos";
import { SubscriptionPresenter } from "./subscriptionDtos";
import { AddressPresenter } from "./addressDtos";
import { UserRole } from "../../models/user.model";

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
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, { message: 'Password must be longer than 7 characters, contain at least one digit and one special character' })
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

export class ValidateUserDTO {
  @IsString()
  @Expose()
  authToken!: string;
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
  phone?: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  subscriptionsAutoRenew?: boolean;
}

export class AdminUserToModify {
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

  @IsEnum(UserRole)
  @Expose()
  @IsOptional()
  role?: UserRole;
}

export class SortUserCriteria {
  @IsString()
  @IsOptional()
  @IsIn(["lastName", "firstName", "email", "createdAt", "lastLogin"])
  @Expose()
  sortBy?: "lastName" | "firstName" | "email" | "createdAt" | "lastLogin";

  @IsString()
  @IsOptional()
  @IsIn(["asc", "desc"])
  @Expose()
  sortOrder?: "asc" | "desc";

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

  @IsString()
  @IsOptional()
  @Expose()
  authToken?: string;

  @IsString()
  @IsOptional()
  @Expose()
  role?: string;

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

export class AdminSearchUserCriteria extends SearchUserCriteria {
  @IsString()
  @IsOptional()
  @Expose()
  authToken?: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  isValidated?: boolean;

  @IsString()
  @IsOptional()
  @Expose()
  paymentSessionId?: string;

  @IsString()
  @IsOptional()
  @Expose()
  stripeCustomerId?: string;
}

export class UserLogin {
  @IsString()
  @Expose()
  email!: string;

  @IsString()
  @Expose()
  password!: string;
}

export class ValidateLogin{
  @IsString()
  @Expose()
  email!: string;

  @IsString()
  @Expose()
  authCode!: string;
}

export class UserToReplace extends UserToCreate {}

export class LiteUserPresenter {
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
  @IsEnum(UserRole)
  role!: UserRole;
}

export class UserPresenter extends LiteUserPresenter {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemPresenter)
  cart?: CartItemPresenter;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionPresenter)
  subscriptions?: SubscriptionPresenter;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressPresenter)
  addresses?: AddressPresenter;
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
  @ValidateNested({ each: true })
  @Type(() => AddressPresenter)
  addresses?: AddressPresenter;

  @Expose()
  password!: string;

  @Expose()
  resetPasswordToken?: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}