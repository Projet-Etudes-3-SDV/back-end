import { ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import "reflect-metadata";
import { CategorySectionDTO, HeaderDTO } from "../requests/landing.requests"
import { ProductPresenter } from "./product.responses";

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
  @Type(() => CategorySectionDTO)
  categorySection?: CategorySectionDTO;
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

class ProductsPresenter {
  @Expose()
  @Type(() => ProductPresenter)
  product!: ProductPresenter;

  @Expose()
  order!: number;
}