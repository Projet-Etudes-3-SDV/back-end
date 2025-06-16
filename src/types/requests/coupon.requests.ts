import { IsNumber, Min, Max, IsDate, IsEnum, IsString, IsOptional, IsArray } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { SubscriptionDuration } from '../../models/coupons.model';

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
