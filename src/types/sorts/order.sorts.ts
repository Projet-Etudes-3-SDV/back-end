import { Expose } from "class-transformer";
import { IsString, IsOptional, IsIn } from "class-validator";

export class SortOrderCriteria {
  @IsString()
  @IsOptional()
  @IsIn(["orderDate", "total", "status"])
  @Expose()
  sortBy?: "orderDate" | "total" | "status";

  @IsOptional()
  @IsString()
  @IsIn(["asc", "desc"])
  @Expose()
  sortOrder?: "asc" | "desc";
}
