import { IsString, IsNumber, IsEnum, IsOptional, Min, ValidateNested } from "class-validator";
import { OrderStatus } from "../../models/order.model";
import { SubscriptionPlan } from "../../models/subscription.model";
import { Expose, Type } from "class-transformer";

export class OrderProductsCreation {
  @IsString()
  @Expose()
  product!: string;

  @IsNumber()
  @Expose()
  plan!: SubscriptionPlan;
}

export class OrderToCreate {
  @IsString()
  @Expose()
  user!: string;

  @IsNumber()
  @Min(0)
  @Expose()
  total!: number;

  @IsEnum(OrderStatus)
  @Expose()
  status!: OrderStatus;

  @ValidateNested({ each: true })
  @Type(() => OrderProductsCreation)
  @Expose()
  products!: OrderProductsCreation[];

  @IsOptional()
  @IsString()
  @Expose()
  sessionId?: string;
}

export class OrderToModify {
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Expose()
  total?: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  @Expose()
  status?: OrderStatus;
}
