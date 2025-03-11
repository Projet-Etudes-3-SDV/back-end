import { Expose, Type } from "class-transformer";
import { IsString, IsNotEmpty, IsUUID } from "class-validator";
import { ProductPresenter } from "./productDtos";

export class AddItemToCartDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsUUID()
  @IsNotEmpty()
  productId!: string;
}

export class DeleteItemFromCartDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsUUID()
  @IsNotEmpty()
  productId!: string;
}

export class ResetCartDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;
}

export class Products {
  @Expose()
  @Type(() => ProductPresenter)
  product!: ProductPresenter;

  @Expose()
  quantity!: number;
}

export class CartItemPresenter {
  @Expose()
  id!: string;

  @Expose()
  @Type(() => Products)
  products!: Products;

  @Expose()
  quantity!: number;
}