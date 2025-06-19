import { IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import "reflect-metadata";
import { HeaderDTO } from "../requests/landing.requests"
import { ProductPresenter } from "./product.responses";
import { AlertType } from "../../models/landing.model";
import { CategoryPresenter } from "./category.responses";

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
  @ValidateIf((obj) => obj.alert !== null && obj.alert !== undefined)
  alert: AlertSectionPresenter | null = null;

  @Expose()
  isMain!: boolean;

  @Expose()
  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @Expose()
  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;
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
  @Type(() => CategoriesPresenter)
  @Expose()
  categories!: CategoriesPresenter[];
}

class ProductsPresenter {
  @Expose()
  @Type(() => ProductPresenter)
  product!: ProductPresenter;

  @Expose()
  order!: number;
}

class CategoriesPresenter {
  @Expose()
  @Type(() => CategoryPresenter)
  category!: CategoryPresenter;

  @Expose()
  order!: number;
}
