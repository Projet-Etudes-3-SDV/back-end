export enum AddressType {
  BILLING = "billing",
  SHIPPING = "shipping",
}

export interface IAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  type?: AddressType;
  phone?: string;
}