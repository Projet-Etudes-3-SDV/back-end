import { Request, Response, NextFunction } from "express";
import { AddressService } from "../services/address.service";
import { AddressToCreate, AddressToModify } from "../types/dtos/addressDtos";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { AppError } from "../utils/AppError";

export class AddressController {
  private addressService: AddressService;

  constructor() {
    this.addressService = new AddressService();
  }

  async createAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const addressData = plainToClass(AddressToCreate, req.body);
      const dtoErrors = await validate(addressData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const address = await this.addressService.createAddress(addressData);
      res.status(201).json(address);
    } catch (error) {
      next(error);
    }
  }

  async getAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError("Validation failed", 400, [{ field: "id", constraints: ["id should not be empty"] }]);
      }
      const address = await this.addressService.getAddress(id);
      res.status(200).json(address);
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const addressData = plainToClass(AddressToModify, req.body);
      const dtoErrors = await validate(addressData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const address = await this.addressService.updateAddress(id, addressData);
      res.status(200).json(address);
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError("Validation failed", 400, [{ field: "id", constraints: ["id should not be empty"] }]);
      }
      await this.addressService.deleteAddress(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
