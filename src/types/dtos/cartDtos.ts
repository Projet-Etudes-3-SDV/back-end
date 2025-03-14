import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID, ValidateNested } from "class-validator";
import { ProductPresenter } from "./productDtos";

export class AddItemToCartDto {
  @IsUUID()
  @IsNotEmpty()
  @Expose()
  userId!: string;

  @IsUUID()
  @IsNotEmpty()
  @Expose()
  productId!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  plan!: string;
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