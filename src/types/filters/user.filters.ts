import { Expose, Type } from "class-transformer";
import { IsString, IsOptional, Min, Max, IsBoolean } from "class-validator";

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

  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @Expose()
  page?: number;

  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @Max(100)
  @Expose()
  limit?: number;
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
