import { Expose } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsOptional, IsArray } from 'class-validator';
import Stripe from 'stripe';

export interface ISubscriptionCoupon {
    name: string;
    reduction: number;
    reductionType: 'percentage' | 'fixed';
    startDate: Date;
    endDate?: Date;
}

export interface IAdminSubscriptionCoupon extends ISubscriptionCoupon {
    code: string;
    promotionCodeId: string;
    couponId: string;
    duration: Stripe.Coupon.Duration;
    durationInMonths?: number | undefined | null;
    isActive: boolean;
    timesReedeemed: number;
}

export class CouponToCreate {
    @IsNumber()
    @Expose()
    discount!: number;

    @IsDate()
    @Expose()
    expirationDate!: Date;

    @IsOptional()
    @IsArray()
    @Expose()
    products!: string[]
}

export class CouponToModify {
    @IsOptional()
    @IsString()
    @Expose()
    code?: string;

    @IsOptional()
    @IsNumber()
    @Expose()
    discount?: number;

    @IsOptional()
    @IsDate()
    @Expose()
    expirationDate?: Date;
}

export class CouponPresenter {
    @IsString()
    @Expose()
    name!: string;

    @IsNumber()
    @Expose()
    reduction!: number;

    @IsString()
    @Expose()
    reductionType!: 'percentage' | 'fixed';

    @IsDate()
    @Expose()
    startDate!: Date;

    @IsOptional()
    @IsDate()
    @Expose()
    endDate?: Date;
}