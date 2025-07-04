import { Expose, Type } from "class-transformer";
import { IsArray, ValidateNested, IsEnum } from "class-validator";
import { UserRole } from "../../models/user.model";
import { SubscriptionPresenter } from "./subscription.responses";
import { CartItemPresenter } from "./cart.responses";
import { AddressPresenter } from "./address.responses";

export class LiteUserPresenter {
  @Expose()
  id!: string;

  @Expose()
  lastName!: string;

  @Expose()
  firstName!: string;

  @Expose()
  email!: string;

  @Expose()
  phone?: string;

  @Expose()
  @IsEnum(UserRole)
  role!: UserRole;

  @Expose()
  lastLogin?: Date;
}

export class UserPresenter extends LiteUserPresenter {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemPresenter)
  cart?: CartItemPresenter;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionPresenter)
  subscriptions?: SubscriptionPresenter;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressPresenter)
  addresses?: AddressPresenter;
}

export class AdminUserPresenter extends LiteUserPresenter {
  @Expose()
  @Type(() => SubscriptionPresenter)
  subscriptions?: SubscriptionPresenter;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => AddressPresenter)
  addresses?: AddressPresenter;

  @Expose()
  password!: string;

  @Expose()
  resetPasswordToken?: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
