import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID, ValidateNested } from "class-validator";
import { ProductPresenter } from "./productDtos";
import { SubscriptionPlan } from "../../models/subscription.model";

export class AddItemToCartDto {
  @IsUUID()
  @IsNotEmpty({message: "Vous devez être connecté pour ajouter un produit à votre panier"})
  @Expose()
  userId!: string;

  @IsUUID()
  @IsNotEmpty({message: "Vous devez être renseigner un produit"})
  @Expose()
  productId!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  plan!: SubscriptionPlan;
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
  plan!: SubscriptionPlan;
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