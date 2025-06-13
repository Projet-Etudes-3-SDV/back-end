import { IsString, IsOptional, IsEnum, Min, Max } from "class-validator";
import { OrderStatus } from "../../models/order.model";
import { Expose, Type } from "class-transformer";

export class SearchOrderCriteria {
  @IsString()
  @IsOptional()
  @Expose()
  id?: string;

  @IsString()
  @IsOptional()
  @Expose()
  user?: string;

  @IsEnum(OrderStatus)
  @IsOptional()
  @Expose()
  status?: OrderStatus;

  @IsString()
  @IsOptional()
  @Expose()
  sessionId?: string;

  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @Expose()
  page: number = 1;

  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @Expose()
  limit: number = 10;
}
