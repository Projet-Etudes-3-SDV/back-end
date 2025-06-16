import { Expose } from "class-transformer";
import { IsString, IsOptional, IsIn } from "class-validator";

export class SortUserCriteria {
  @IsString()
  @IsOptional()
  @IsIn(["lastName", "firstName", "email", "createdAt", "lastLogin"])
  @Expose()
  sortBy?: "lastName" | "firstName" | "email" | "createdAt" | "lastLogin";

  @IsString()
  @IsOptional()
  @IsIn(["asc", "desc"])
  @Expose()
  sortOrder?: "asc" | "desc";
}
