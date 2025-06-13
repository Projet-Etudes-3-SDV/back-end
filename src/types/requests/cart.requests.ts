import { IsUUID, IsNotEmpty, IsString } from "class-validator";
import { SubscriptionPlan } from "../../models/subscription.model";
import { Expose } from "class-transformer";

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
