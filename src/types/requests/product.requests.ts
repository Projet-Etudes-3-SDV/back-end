import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max, IsUUID, ValidateNested, ArrayNotEmpty } from "class-validator";
import { FeaturesPresenter } from "../responses/product.responses";
import { Expose, Type } from "class-transformer";

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
  @Min(0)
  @Max(1000000)
  monthlyPrice!: number;

  @IsNumber()
  @Expose()
  @Min(0)
  @Max(1000000)
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

export class ProductToModifyDTO {
  @IsString()
  @IsOptional()
  @Expose()
  name?: string;

  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  active?: boolean;

  @IsUUID()
  @IsOptional()
  @Expose()
  category?: string;

  @IsNumber()
  @IsOptional()
  @Expose()
  @Min(0)
  @Max(1000000)
  monthlyPrice?: number;

  @IsNumber()
  @IsOptional()
  @Expose()
  @Min(0)
  @Max(1000000)
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

export class ProductToReplace extends ProductToCreate {}
