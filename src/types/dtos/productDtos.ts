import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max } from "class-validator";
import { Expose, Type } from "class-transformer";
import "reflect-metadata";

export class ProductToCreate {
  @IsString()
  @Expose()
  name!: string;

  @IsString()
  @Expose()
  description!: string;

  @IsString()
  @Expose()
  categoryId!: string;

  @IsNumber()
  @Expose()
  monthlyPrice!: number;

  @IsNumber()
  @Expose()
  yearlyPrice!: number;

  @IsBoolean()
  @IsOptional()
  @Expose()
  available?: boolean;
}

export class ProductToModify {
  @IsString()
  @IsOptional()
  @Expose()
  name?: string;

  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @IsString()
  @IsOptional()
  @Expose()
  categoryId?: string;

  @IsNumber()
  @IsOptional()
  @Expose()
  monthlyPrice?: number;

  @IsNumber()
  @IsOptional()
  @Expose()
  yearlyPrice?: number;

  @IsBoolean()
  @IsOptional()
  @Expose()
  available?: boolean;
}

export class SearchProductCriteria {
  @IsString()
  @IsOptional()
  @Expose()
  name?: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  available?: boolean;

  @IsNumber()
  @IsOptional()
  @Expose()
  monthlyPrice?: number;

  @IsNumber()
  @IsOptional()
  @Expose()
  yearlyPrice?: number;

  @IsString()
  @IsOptional()
  @Expose()
  categoryId?: string;

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

export class ProductToReplace extends ProductToCreate {}

export class ProductPresenter {
  @Expose()
  _id!: string;

  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  categoryId!: string;

  @Expose()
  monthlyPrice!: number;

  @Expose()
  yearlyPrice!: number;

  @Expose()
  available!: boolean;

  @Expose()
  addedDate!: Date;
}
