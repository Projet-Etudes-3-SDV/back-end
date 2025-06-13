import { IsString, IsNumber, IsEnum, IsOptional, Min, ValidateNested, IsIn, Max } from "class-validator";
import { Expose, Type } from "class-transformer";
import { OrderStatus } from "../../models/order.model";
import { SubscriptionPlan } from "../../models/subscription.model";
import { ProductPresenter } from "./productDtos";
import { LiteUserPresenter } from "./userDtos";

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


export class OrderProductsCreation {
  @IsString()
  @Expose()
  product!: string;

  @IsNumber()
  @Expose()
  plan!: SubscriptionPlan;
}

export class OrderProducts {
  @Type(() => ProductPresenter)
  @ValidateNested()
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
  @Type(() => LiteUserPresenter)
  user!: LiteUserPresenter;

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
