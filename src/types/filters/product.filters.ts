import { Expose, Transform, Type } from "class-transformer";
import { IsString, IsOptional, IsNumber, Min, Max, IsUUID, ValidateNested, IsBoolean} from "class-validator";
import { FeaturesPresenter } from "../responses/product.responses";

export abstract class AbstractSearchProductCriteria {
  @IsString()
  @IsOptional()
  @Expose()
  id?: string;

  @IsString()
  @IsOptional()
  @Expose()
  name?: string;

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

export class SearchProductCriteria extends AbstractSearchProductCriteria {
  @IsOptional()
  @Transform(({ value }) => { return value === 'false' ? false : true })
  @Expose()
  active!: boolean

  @IsOptional()
  @Transform(({ value }) => { return value === 'false' ? false : true })
  @Expose()
  available?: boolean;
}

export class AdminSearchProductCriteria extends AbstractSearchProductCriteria {
  @IsOptional()
  @Expose()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  active: boolean = true;

  @IsOptional()
  @Expose()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  available?: boolean;

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
