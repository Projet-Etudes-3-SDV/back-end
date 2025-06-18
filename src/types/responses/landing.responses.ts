import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import "reflect-metadata";
import { HeaderDTO } from "../requests/landing.requests"
import { ProductPresenter } from "./product.responses";
import { CategoryPresenter } from "./category.responses";
import { AlertType } from "../../models/landing.model";

export class LandingPresenter {
  @Expose()
  id!: string;

  @Expose()
  @ValidateNested()
  @Type(() => HeaderDTO)
  header!: HeaderDTO;

  @Expose()
  @ValidateNested()
  @Type(() => CarouselSectionPresenter)
  carouselSection?: CarouselSectionPresenter;

  @Expose()
  @ValidateNested()
  @Type(() => CategorySectionPresenter)
  categorySection?: CategorySectionPresenter;

  @Expose()
  @ValidateNested()
  @Type(() => AlertSectionPresenter)
  alert?: AlertSectionPresenter;

  @Expose()
  isMain!: boolean;
}

class AlertSectionPresenter {
  @Expose()
  title!: string;

  @Expose()
  description?: string;

  @Expose()
  type!: AlertType; 

  @Expose()
  order!: number;
}

class CarouselSectionPresenter {
  @Expose()
  title!: string;

  @Expose()
  description?: string;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ProductsPresenter)
  products!: ProductsPresenter[];

  @Expose()
  order!: number;
}

export class CategorySectionPresenter {
  @IsString()
  @Expose()
  title!: string;

  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @IsNumber()
  @Expose()
  order!: number;

  @ValidateNested()
  @Type(() => CategoryPresenter)
  @Expose()
  categories!: CategoryPresenter[];
}

class ProductsPresenter {
  @Expose()
  @Type(() => ProductPresenter)
  product!: ProductPresenter;

  @Expose()
  order!: number;
}

