import { Expose, Transform, Type } from "class-transformer";
import { IsString, IsOptional, IsNumber, Min, Max, IsUUID, ValidateNested} from "class-validator";
import { FeaturesPresenter } from "../responses/product.responses";

export class SearchProductCriteria {
  @IsString()
  @IsOptional()
  @Expose()
  id?: string;

  @IsString()
  @IsOptional()
  @Expose()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => { return value === 'false' ? false : true })
  @Expose()
  available?: boolean;

  @IsNumber()
  @IsOptional()
  @Expose()
  @Type(() => Number)
  @Min(0)
  minimumPrice?: number;

  @IsNumber()
  @IsOptional()
  @Expose()
  @Type(() => Number)
  @Min(0)
  maximumPrice?: number;

  @IsOptional()
  @Expose()
  @Transform(({ value }) => { return value === 'true' })
  isYearlyPrice: boolean = false;

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
  features?: Array<FeaturesPresenter>;

  @IsString()
  @IsOptional()
  @Expose()
  description?: string;
}

export class AdminSearchProductCriteria extends SearchProductCriteria {
  @IsOptional()
  @Expose()
  @Transform(({ value }) => { return value === 'true' })
  active: boolean = true;

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
