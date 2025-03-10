import { IsString, IsUUID, IsOptional, Min, Max, IsNumber } from "class-validator";
import { Expose, Type } from "class-transformer";
import "reflect-metadata";

export class CategoryToCreate {
  @IsString()
  @Expose()
  name!: string;

  @IsString()
  @Expose()
  description!: string;
}

export class CategoryToModify {
  @IsString()
  @IsOptional()
  @Expose()
  name?: string;

  @IsString()
  @IsOptional()
  @Expose()
  description?: string;
}

export class SearchCategoryCriteria {
  @IsString()
  @IsOptional()
  @Expose()
  name?: string;

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
}

export class CategoryToReplace extends CategoryToCreate {}

export class CategoryPresenter {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  description!: string;
}
