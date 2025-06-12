import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max, IsUUID, ValidateNested, ArrayNotEmpty, IsIn } from "class-validator";
import { Expose, Transform, Type } from "class-transformer";
import "reflect-metadata";
import { CategoryPresenter } from "./categoryDtos";
import { ICategory } from "../../models/category.model";
import { IProduct } from "../../models/product.model";

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

export class SortProductCriteria {
  @IsOptional()
  @IsString()
  @IsIn(["name", "addedDate", "monthlyPurchaseAmount", "yearlyPurchaseAmount", "monthlyPrice", "yearlyPrice"])
  @Expose()
  sortBy?: string;

  @IsOptional()
  @IsString()
  @IsIn(["asc", "desc"])
  @Expose()
  sortOrder?: "asc" | "desc";
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

export class ProductPriced {
  _id: IProduct["_id"];
  id: string;
  name: string;
  description: string;
  category: ICategory;
  monthlyPrice: number;
  yearlyPrice: number;
  available: boolean;
  features: Array<{ title: string; description: string }>;
  stripePriceId: string
  stripePriceIdYearly: string
  stripeProductId: string
  count?: number
  imageUrl?: string;
  monthlyPurchaseAmount: number;
  yearlyPurchaseAmount: number;

  constructor(product: IProduct, monthlyPrice: number, yearlyPrice: number) {
    this._id = product._id;
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.category = product.category;
    this.monthlyPrice = monthlyPrice;
    this.yearlyPrice = yearlyPrice;
    this.available = product.available;
    this.features = product.features?.map(f => ({
      title: f.title,
      description: f.description
    })) || [];
    this.stripePriceId = product.stripePriceId
    this.stripePriceIdYearly = product.stripePriceIdYearly
    this.stripeProductId = product.stripeProductId
    this.imageUrl = product.imageUrl;
    this.monthlyPurchaseAmount = product.monthlyPurchaseAmount;
    this.yearlyPurchaseAmount = product.yearlyPurchaseAmount;
  }
}

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

  @IsOptional()
  @Expose()
  imageUrl?: string;

  @Expose()
  monthlyPurchaseAmount?: number

  @Expose()
  yearlyPurchaseAmount?: number
}


export class FeaturesPresenter {
  @Expose()
  title!: string;

  @Expose()
  description!: string;
}

export class StripePriceRecurringData {
  @Expose()
  aggregate_usage!: string | null;

  @Expose()
  interval!: string;

  @Expose()
  interval_count!: number;

  @Expose()
  meter!: string | null;

  @Expose()
  trial_period_days!: number | null;

  @Expose()
  usage_type!: string;
}

export class StripePriceData {
  @Expose()
  id!: string;

  @Expose()
  object!: string;

  @Expose()
  active!: boolean;

  @Expose()
  billing_scheme!: string;

  @Expose()
  created!: number;

  @Expose()
  currency!: string;

  @Expose()
  livemode!: boolean;

  @Expose()
  lookup_key!: string | null;


  @Expose()
  nickname!: string | null;

  @Expose()
  product!: string;

  @Expose()
  @Type(() => StripePriceRecurringData)
  recurring!: StripePriceRecurringData;

  @Expose()
  tax_behavior!: string;

  @Expose()
  tiers_mode!: string | null;

  @Expose()
  type!: string;

  @Expose()
  unit_amount!: number;

  @Expose()
  unit_amount_decimal!: string;
}
