import type { Request, Response, NextFunction } from "express";
import { CartService } from "../services/cart.service";
import { AppError } from "../utils/AppError";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { AddItemToCartDto, DeleteItemFromCartDto, ResetCartDto } from "../types/dtos/cartDtos";
import { EncodedRequest } from "../utils/EncodedRequest";

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  async addItemToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const addItemToCartDto = plainToClass(AddItemToCartDto, req.body);
      const dtoErrors = await validate(addItemToCartDto);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const { userId, productId } = addItemToCartDto;
      const updatedUser = await this.cartService.addItemToCart(userId, productId);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async deleteItemFromCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleteItemFromCartDto = plainToClass(DeleteItemFromCartDto, req.body);
      const dtoErrors = await validate(deleteItemFromCartDto);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const { userId, productId } = deleteItemFromCartDto;
      const updatedUser = await this.cartService.deleteItemFromCart(userId, productId);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async resetCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resetCartDto = plainToClass(ResetCartDto, req.body);
      const dtoErrors = await validate(resetCartDto);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const { userId } = resetCartDto;
      const updatedUser = await this.cartService.resetCart(userId);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async updateCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, cart } = req.body;

      const cartDto = plainToClass(ResetCartDto, cart);

      const dtoErrors = await validate(cartDto);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }

      const updatedUser = await this.cartService.updateCart(userId, cart);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async getCart(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.decoded.user.id;
      const cart = await this.cartService.getCart(userId);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }
}
