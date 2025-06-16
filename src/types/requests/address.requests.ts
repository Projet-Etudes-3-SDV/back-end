import { Expose, Type } from "class-transformer";
import { IsString, IsOptional } from "class-validator";
import { AddressType } from "../../models/address.model";

export class AddressToCreate {
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
  type!: AddressType;

  @Expose()
  @IsOptional()
  @IsString()
  phone?: string;
}

export class AddressToModify {
  @Expose()
  @IsOptional()
  @IsString()
  street?: string;

  @Expose()
  @IsOptional()
  @IsString()
  city?: string;

  @Expose()
  @IsOptional()
  @IsString()
  postalCode?: string;

  @Expose()
  @IsOptional()
  @IsString()
  country?: string;

  @Expose()
  @IsOptional()
  @Type(() => String)
  @IsString()
  type?: AddressType;

  @Expose()
  @IsOptional()
  @IsString()
  phone?: string;
}
