import { Expose } from "class-transformer";
import { IsOptional, IsString, IsIn } from "class-validator";

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
