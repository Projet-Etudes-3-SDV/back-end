import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, IsBoolean } from "class-validator";
import { Expose, Type } from "class-transformer";
import "reflect-metadata";
import { ObjectId } from "mongoose";

export class CarouselProductDTO {
  @IsString()
  @Expose()
  product!: string | ObjectId;

  @IsNumber()
  @Expose()
  order!: number;
}

export class HeaderDTO {
  @IsString()
  @Expose()
  title!: string;

  @IsString()
  @IsOptional()
  @Expose()
  subtitle?: string;
}

export class CarouselSectionDTO {
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

export class CategorySectionDTO {
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

  @IsBoolean()
  @IsOptional()
  @Expose()
  isMain?: boolean;
}



export class LandingToModify {
  @ValidateNested()
  @Type(() => HeaderDTO)
  @Expose()
  header!: HeaderDTO;

  @ValidateNested()
  @Type(() => CarouselSectionDTO)
  @Expose()
  carouselSection!: CarouselSectionDTO;

  @ValidateNested()
  @Type(() => CategorySectionDTO)
  @Expose()
  categorySection!: CategorySectionDTO;

  @IsBoolean()
  @Expose()
  isMain!: boolean;
}
