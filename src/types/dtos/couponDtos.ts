import { Expose, Type } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ProductPresenter } from './productDtos';

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
    id!: string;

    @IsString()
    @Expose()
    code!: string;

    @IsNumber()
    @Expose()
    discount!: number;

    @IsDate()
    @Expose()
    expirationDate!: Date;

    @Expose()
    @ValidateNested({ each: true })
    @Type(() => ProductPresenter)
    products!: ProductPresenter[]
}