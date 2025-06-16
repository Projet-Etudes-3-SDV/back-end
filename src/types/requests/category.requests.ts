import { Expose } from "class-transformer";
import { IsString, IsOptional } from "class-validator";

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

export class CategoryToReplace extends CategoryToCreate {}
