import { IsString, IsOptional, IsBoolean, IsDate, Matches, IsEnum } from "class-validator";
import { UserRole } from "../../models/user.model";
import { Expose } from "class-transformer";

export class ValidateUserDTO {
  @IsString()
  @Expose()
  authToken!: string;
}

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

export class UserToReplace extends UserToCreate {}

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
