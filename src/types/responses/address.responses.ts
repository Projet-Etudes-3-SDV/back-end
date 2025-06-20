import { Expose, Type } from "class-transformer";
import { IsString, IsOptional } from "class-validator";
import { AddressType } from "../../models/address.model";

export class AddressPresenter {
  @Expose()
  @IsString()
  street!: string;

  @Expose()
  @IsString()
  city!: string;

  @Expose()
  @IsString()
  postalCode!: string;

  @Expose()
  @IsString()
  country!: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  type?: AddressType;

  @Expose()
  @IsOptional()
  @IsString()
  phone?: string;
}
