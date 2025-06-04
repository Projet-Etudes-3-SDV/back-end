export enum AdressType {
  BILLING = "billing",
  SHIPPING = "shipping",
}

export interface IAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  type: AdressType;
  phone?: string;
}