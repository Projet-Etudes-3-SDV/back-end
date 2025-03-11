import { IsString, IsNumber, Min, Max, IsOptional, ValidateNested, IsArray } from "class-validator";
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
}
