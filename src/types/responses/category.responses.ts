import { Expose } from "class-transformer";
import { IsOptional } from "class-validator";

export class CategoryPresenter {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @IsOptional()
  @Expose()
  imageUrl?: string;
}
