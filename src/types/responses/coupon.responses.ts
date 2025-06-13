import { Expose } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

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
