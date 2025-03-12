import { AddressRepository } from "../repositories/address.repository";
import type { IAddress } from "../models/adress.model";
import { AppError } from "../utils/AppError";
import { AddressToCreate, AddressToModify } from "../types/dtos/addressDtos";
import { UserRepository } from "../repositories/user.repository";

export class AddressService {
  private addressRepository: AddressRepository;
  private userRepository: UserRepository;

  constructor() {
    this.addressRepository = new AddressRepository();
    this.userRepository = new UserRepository();
  }

  async createAddress(addressData: AddressToCreate): Promise<IAddress> {
    const user = await this.userRepository.findOneBy({ id: addressData.userId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    addressData.userId = user._id;

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
    const address = await this.addressRepository.findById(id);
    if (!address) {
      throw new AppError("Address not found", 404);
    }

    const user = await this.userRepository.findOneBy({ _id: address.userId });
    if (!user || user._id !== address.userId) {
      throw new AppError("Unauthorized to update this address", 403);
    }

    const updatedAddress = await this.addressRepository.update(id, addressData);
    if (!updatedAddress) {
      throw new AppError("Failed to update address", 500);
    }
    return updatedAddress;
  }

  async deleteAddress(id: string): Promise<void> {
    const address = await this.addressRepository.findById(id);
    if (!address) {
      throw new AppError("Address not found", 404);
    }

    const user = await this.userRepository.findOneBy({ _id: address.userId });
    if (!user) {
      throw new AppError("Unauthorized to delete this address", 403);
    }

    user.addresses = user.addresses.filter((addressId) => addressId.id !== id);

    const result = await this.addressRepository.delete(id);
    if (!result) {
      throw new AppError("Failed to delete address", 500);
    }
  }
}
