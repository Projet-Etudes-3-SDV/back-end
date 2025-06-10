import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max, IsUUID, ValidateNested, ArrayNotEmpty } from "class-validator";
import { Expose, Type } from "class-transformer";
import "reflect-metadata";
import { CategoryPresenter } from "./categoryDtos";

export class ProductToCreate {
  @IsString()
  @Expose()
  name!: string;

  @IsString()
  @Expose()
  description!: string;

  @IsUUID()
  @Expose()
  category!: string;

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

  @Expose()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FeaturesPresenter)
  features!: Array<FeaturesPresenter>;

  @IsString()
  @IsOptional()
  @Expose()
  stripeProductId?: string;

  @IsString()
  @IsOptional()
  @Expose()
  stripePriceId?: string;

  @IsString()
  @IsOptional()
  @Expose()
  stripePriceIdYearly?: string;
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

  @IsUUID()
  @IsOptional()
  @Expose()
  category?: string;

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

  @Expose()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FeaturesPresenter)
  features?: Array<FeaturesPresenter>;

  @IsString()
  @IsOptional()
  @Expose()
  stripeProductId?: string;

  @IsString()
  @IsOptional()
  @Expose()
  stripePriceId?: string;

  @IsString()
  @IsOptional()
  @Expose()
  stripePriceIdYearly?: string;
}

export class SearchProductCriteria {
  @IsString()
  @IsOptional()
  @Expose()
  id?: string;

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

  @IsUUID()
  @IsOptional()
  @Expose()
  category?: string;

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

  @Expose()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FeaturesPresenter)
  features!: Array<FeaturesPresenter>;
}

export class ProductToReplace extends ProductToCreate {}

export class ProductPresenter {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  @Type(() => CategoryPresenter)
  category!: CategoryPresenter;

  @Expose()
  monthlyPrice!: number;

  @Expose()
  yearlyPrice!: number;

  @Expose()
  available!: boolean;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => FeaturesPresenter)
  features!: Array<FeaturesPresenter>;
}

export class FeaturesPresenter {
  @Expose()
  title!: string;

  @Expose()
  description!: string;
}
