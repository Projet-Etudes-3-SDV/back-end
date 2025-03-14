import type { Request, Response, NextFunction } from "express";
import { CartService } from "../services/cart.service";
import { AppError } from "../utils/AppError";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { AddItemToCartDto, DeleteItemFromCartDto, ResetCartDto, CartItemPresenter } from "../types/dtos/cartDtos";
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
      const { userId, productId, plan } = addItemToCartDto;
      const cart = await this.cartService.addItemToCart(userId, productId, plan);
      const sanitizedUser = {
          ...cart.toObject(),
          owner: cart.owner.id
  
        };
            const cartPresenter = plainToClass(CartItemPresenter, sanitizedUser, { excludeExtraneousValues: true });


      res.status(200).json(cartPresenter);
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
      const updatedUserCart = await this.cartService.deleteItemFromCart(userId, productId);
      const sanitizedUser = {
          ...updatedUserCart.toObject(),  
        };
            const cartPresenter = plainToClass(CartItemPresenter, sanitizedUser, { excludeExtraneousValues: true });


      res.status(200).json(cartPresenter);
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
      const updatedUserCart = await this.cartService.resetCart(userId);
      const sanitizedUser = {
          ...updatedUserCart.toObject()
  
        };
            const cartPresenter = plainToClass(CartItemPresenter, sanitizedUser, { excludeExtraneousValues: true });


      res.status(200).json(cartPresenter);
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

      const updatedUserCart = await this.cartService.updateCart(userId, cart);
      const sanitizedUser = {
          ...updatedUserCart.toObject() 
  
        };
            const cartPresenter = plainToClass(CartItemPresenter, sanitizedUser, { excludeExtraneousValues: true });


      res.status(200).json(cartPresenter);
    } catch (error) {
      next(error);
    }
  }

  async getCart(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.decoded.user.id;
      const updatedUserCart = await this.cartService.getCart(userId);
      const sanitizedUser = {
          ...updatedUserCart.toObject()  
        };
      const cartPresenter = plainToClass(CartItemPresenter, sanitizedUser, { excludeExtraneousValues: true });

      res.status(200).json(cartPresenter);
    } catch (error) {
      next(error);
    }
  }

  async validateCart(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.decoded.user.id;
      const cart = await this.cartService.validateCart(userId);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }
}
