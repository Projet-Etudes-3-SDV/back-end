import { Expose, Type } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsOptional, IsArray, IsEnum, Max, Min } from 'class-validator';
import Stripe from 'stripe';

export interface ISubscriptionCoupon {
    name: string;
    reduction: number;
    reductionType: 'percentage' | 'fixed';
    startDate: Date;
    endDate?: Date;
}

export enum SubscriptionDuration {
    FOREVER = "forever",
    ONCE = "once",
    REPEATING = "repeating"
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
    @Min(0)
    @Max(100)
    @Expose()
    discount!: number;

    @Type(() => Date)
    @IsDate()
    @Expose()
    expirationDate!: Date;

    @IsEnum(SubscriptionDuration)
    @Expose()
    duration!: SubscriptionDuration

    @IsString()
    @Expose()
    name!: string

    @IsString()
    @Expose()
    code!: string

    @IsOptional()
    @IsArray()
    @Expose()
    products?: string[]

    @IsOptional()
    @IsNumber()
    @Expose()
    durationInMonth?: number

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Expose()
    max_redemptions!: number
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