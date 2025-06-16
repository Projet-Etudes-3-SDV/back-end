import { IsString, IsDate, IsBoolean, IsNumber } from "class-validator";
import { Expose, Type } from "class-transformer";
import { ProductPresenter } from "./product.responses";
import { CouponPresenter } from "./coupon.responses";

export class SubscriptionPresenter {
  @IsString()
  @Expose()
  id!: string;

  @IsString()
  @Expose()
  name!: string;

  @IsString()
  @Expose()
  description!: string;

  @IsNumber()
  @Expose()
  price!: number;

  @IsString()
  @Expose()
  currency!: string;

  @IsDate()
  @Expose()
  startDate!: Date;

  @IsDate()
  @Expose()
  endDate!: Date;

  @IsString()
  @Expose()
  status!: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'trialing';

  @IsString()
  @Expose()
  planType!: 'monthly' | 'yearly';

  @Expose()
  @Type(() => CouponPresenter)
  coupon?: CouponPresenter;

  @IsBoolean()
  @Expose()
  cancelAtPeriodEnd!: boolean;

  @Expose()
  @Type(() => ProductPresenter)
  product!: ProductPresenter;
}
