import { AdressType } from "../../models/adress.model";

export class AddressToCreate {
  userId!: string;
  street!: string;
  city!: string;
  postalCode!: string;
  country!: string;
  type!: AdressType;
  phone?: string;
}

export class AddressToModify {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  type?: AdressType;
  phone?: string;
}
