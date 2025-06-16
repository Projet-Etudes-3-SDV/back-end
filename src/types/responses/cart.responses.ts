import { ValidateNested, IsString } from "class-validator";
import { ProductPresenter } from "../responses/product.responses";
import { Expose, Type } from "class-transformer";

export class Products {
  @Expose()
  @Type(() => ProductPresenter)
  product!: ProductPresenter;

  @Expose()
  quantity!: number;

  @Expose()
  @IsString()
  plan!: string;
}

export class CartItemPresenter {
  @Expose()
  id!: string;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Products)
  products!: Products[];

  @Expose()
  @Type(() => UserCartPresenter)
  owner!: UserCartPresenter;
}

export class UserCartPresenter {
  @Expose()
  id!: string;

  @Expose()
  @IsString()
  lastName!: string;

  @Expose()
  @IsString()
  firstName!: string;
}
