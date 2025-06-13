import { Expose, Type } from "class-transformer";
import { IsString, IsOptional, IsNumber, Min, Max } from "class-validator";

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
