import { IsString, IsNotEmpty, IsUUID } from "class-validator";

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
