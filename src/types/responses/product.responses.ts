import { Expose, Type } from "class-transformer";
import { CategoryPresenter } from "./category.responses";
import { IsOptional, ValidateNested } from "class-validator";
import "reflect-metadata";

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
}

export class AdminProductPresenter extends ProductPresenter {
  @Expose()
  stripeProductId!: string;

  @Expose()
  stripePriceId!: string;

  @Expose()
  stripePriceIdYearly!: string;

  @Expose()
  monthlyPurchaseAmount!: number;

  @Expose()
  yearlyPurchaseAmount!: number;
}

export class FeaturesPresenter {
  @Expose()
  title!: string;

  @Expose()
  description!: string;
}
