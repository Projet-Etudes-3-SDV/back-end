import { AddressRepository } from "../repositories/address.repository";
import type { IAddress } from "../models/adress.model";
import { AppError } from "../utils/AppError";
import { AddressToCreate, AddressToModify } from "../types/dtos/addressDtos";

export class AddressService {
  private addressRepository: AddressRepository;

  constructor() {
    this.addressRepository = new AddressRepository();
  }

  async createAddress(addressData: AddressToCreate): Promise<IAddress> {
    return await this.addressRepository.create(addressData);
  }

  async getAddress(id: string): Promise<IAddress> {
    const address = await this.addressRepository.findById(id);
    if (!address) {
      throw new AppError("Address not found", 404);
    }
    return address;
  }

  async updateAddress(id: string, addressData: AddressToModify): Promise<IAddress> {
    const address = await this.addressRepository.update(id, addressData);
    if (!address) {
      throw new AppError("Address not found", 404);
    }
    return address;
  }

  async deleteAddress(id: string): Promise<void> {
    const result = await this.addressRepository.delete(id);
    if (!result) {
      throw new AppError("Failed to delete address", 500);
    }
  }
}
