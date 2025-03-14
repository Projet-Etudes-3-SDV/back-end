import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID, ValidateNested } from "class-validator";
import { ProductPresenter } from "./productDtos";
import { SubscriptionPlan } from "../../models/subscription.model";

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
}

export class CartPresenter {
  @Expose()
  id!: string;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Products)
  products!: Products[];

  @Expose()
  owner!: string;
}