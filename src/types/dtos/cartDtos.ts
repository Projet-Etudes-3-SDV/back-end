import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID, ValidateNested } from "class-validator";
import { ProductPresenter, ProductPriced } from "./productDtos";
import { SubscriptionPlan } from "../../models/subscription.model";
import { IUser } from "../../models/user.model";
import { ICart } from "../../models/cart.model";

export class CartWithPricedProducts{
  id!: string;
  products: { product: ProductPriced, quantity: number, plan: SubscriptionPlan }[];
  owner: IUser;
  
  constructor(cart: ICart, products: ProductPriced[]) {
    this.id = cart.id;
    this.owner = cart.owner;
    this.products = []
    for (const product of products) {
      const cartProduct = cart.products.find(p => p.product.id === product.id);
      if (cartProduct) {
        this.products.push({
          product,
          quantity: cartProduct.quantity,
          plan: cartProduct.plan
        });
      }
    }
  }
}

export class AddItemToCartDto {
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