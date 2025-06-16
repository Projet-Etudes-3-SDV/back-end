import { ValidateNested } from "class-validator";
import { LiteUserPresenter } from "../responses/user.responses";
import { ProductPresenter } from "../responses/product.responses";
import { OrderStatus } from "../../models/order.model";
import { Expose, Type } from "class-transformer";

export class OrderProducts {
  @Type(() => ProductPresenter)
  @ValidateNested()
  @Expose()
  product!: ProductPresenter;

  @Expose()
  plan!: number;
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
