import { IsString, IsNumber, IsEnum, IsOptional, Min, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { OrderStatus } from "../../models/order.model";
import { SubscriptionPlan } from "../../models/subscription.model";
import { ProductPresenter } from "./productDtos";

export class OrderProductsCreation {
  @IsString()
  @Expose()
  product!: string;

  @IsNumber()
  @Expose()
  plan!: SubscriptionPlan;
}

export class OrderProducts {
  @IsString()
  @Expose()
  product!: ProductPresenter;

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

export class OrderPresenter {
  @Expose()
  id!: string;

  @Expose()
  user!: string;

  @Expose()
  total!: number;

  @Expose()
  status!: OrderStatus;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => OrderProducts)
  products!: OrderProducts[];

  @Expose()
  @Type(() => Date)
  orderDate!: Date;
}
