import Address, { type IAddress } from "../models/adress.model";
import { AddressToCreate, AddressToModify } from "../types/dtos/addressDtos";

export class AddressRepository {
  async create(addressData: AddressToCreate): Promise<IAddress> {
    const address = new Address(addressData);
    return await address.save();
  }

  async findById(id: string): Promise<IAddress | null> {
    return await Address.findOne({ id });
  }


  async update(id: string, addressData: AddressToModify): Promise<IAddress | null> {
    return await Address.findOneAndUpdate({ id }, addressData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Address.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
