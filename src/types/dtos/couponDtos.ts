import { Expose } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsOptional, IsArray } from 'class-validator';

export interface ISubscriptionCoupon {
    name: string;
    reduction: number; // Pourcentage ou montant fixe
    reductionType: 'percentage' | 'fixed'; // Type de réduction
    startDate: Date;
    endDate?: Date; // Optionnel pour les coupons permanents
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