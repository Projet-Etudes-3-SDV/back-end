import { IsString, IsOptional, IsArray, ValidateNested, IsNumber } from "class-validator";
import { Expose, Type } from "class-transformer";
import "reflect-metadata";
import { ObjectId } from "mongoose";

class CarouselProductDTO {
  @IsString()
  @Expose()
  product!: string | ObjectId;

  @IsNumber()
  @Expose()
  order!: number;
}

class HeaderDTO {
  @IsString()
  @Expose()
  title!: string;

  @IsString()
  @IsOptional()
  @Expose()
  subtitle?: string;
}

class CarouselSectionDTO {
  @IsString()
  @Expose()
  title!: string;

  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CarouselProductDTO)
  @Expose()
  products!: CarouselProductDTO[];

  @IsNumber()
  @Expose()
  order!: number;
}

class CategorySectionDTO {
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
}

export class LandingToCreate {
  @ValidateNested()
  @Type(() => HeaderDTO)
  @Expose()
  header!: HeaderDTO;

  @ValidateNested()
  @Type(() => CarouselSectionDTO)
  @IsOptional()
  @Expose()
  carouselSection?: CarouselSectionDTO;

  @ValidateNested()
  @Type(() => CategorySectionDTO)
  @IsOptional()
  @Expose()
  categorySection?: CategorySectionDTO;
}

export class LandingToModify {
  @ValidateNested()
  @Type(() => HeaderDTO)
  @IsOptional()
  @Expose()
  header?: HeaderDTO;

  @ValidateNested()
  @Type(() => CarouselSectionDTO)
  @IsOptional()
  @Expose()
  carouselSection?: CarouselSectionDTO;

  @ValidateNested()
  @Type(() => CategorySectionDTO)
  @IsOptional()
  @Expose()
  categorySection?: CategorySectionDTO;
}

export class LandingPresenter {
  @Expose()
  id!: string;

  @Expose()
  @ValidateNested()
  @Type(() => HeaderDTO)
  header!: HeaderDTO;

  @Expose()
  @ValidateNested()
  @Type(() => CarouselSectionDTO)
  carouselSection?: CarouselSectionDTO;

  @Expose()
  @ValidateNested()
  @Type(() => CategorySectionDTO)
  categorySection?: CategorySectionDTO;
}
