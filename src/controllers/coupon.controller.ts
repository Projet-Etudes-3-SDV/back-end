import type { Request, Response, NextFunction } from "express";
import { CouponService } from "../services/coupon.service";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { CouponToCreate, CouponToModify, CouponPresenter } from "../types/dtos/couponDtos";
import { AppError } from "../utils/AppError";

export class CouponController {
  private couponService: CouponService;

  constructor() {
    this.couponService = new CouponService();
  }

  async getCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupons = await this.couponService.getCoupons();
      const couponPresenters = plainToClass(CouponPresenter, coupons, { excludeExtraneousValues: true });
      res.status(200).json(couponPresenters);
    } catch (error) {
      next(error);
    }
  }

  async createCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const couponData = plainToClass(CouponToCreate, req.body);
      const dtoErrors = await validate(couponData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const newCoupon = await this.couponService.createCoupon(couponData);
      const couponPresenter = plainToClass(CouponPresenter, newCoupon, { excludeExtraneousValues: true });
      res.status(201).json(couponPresenter);
    } catch (error) {
      next(error);
    }
  }

  async updateCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const couponData = plainToClass(CouponToModify, req.body);
      const dtoErrors = await validate(couponData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const updatedCoupon = await this.couponService.updateCoupon(id, couponData);
      const couponPresenter = plainToClass(CouponPresenter, updatedCoupon, { excludeExtraneousValues: true });
      res.status(200).json(couponPresenter);
    } catch (error) {
      next(error);
    }
  }

  async deleteCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.couponService.deleteCoupon(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
