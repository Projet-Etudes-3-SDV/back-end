import type { Request, Response, NextFunction } from "express";
import { CouponService } from "../services/coupon.service";
import { CouponToCreate } from "../types/dtos/couponDtos";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { AppError } from "../utils/AppError";

export class CouponController {
  private couponService: CouponService;

  constructor() {
    this.couponService = new CouponService();
  }

  async getCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupons = await this.couponService.getCoupons();
      res.status(200).json(coupons);
    } catch (error) {
      next(error);
    }
  }

  async createCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const couponCreation = plainToClass(CouponToCreate, req.body);
      const dtoErrors = await validate(couponCreation);
            if (dtoErrors.length > 0) {
              const errors = dtoErrors.map(error => ({
                field: error.property,
                constraints: error.constraints ? Object.values(error.constraints) : []
              }));
              throw new AppError("Validation failed", 400, errors);
            }
      const newCoupon = await this.couponService.createCoupon(couponCreation);

      res.status(201).json(newCoupon);
    } catch (error) {
      next(error);
    }
  }

  async cancelPromotionCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updatedCoupon = await this.couponService.cancelPromotionCode(id);

      res.status(200).json(updatedCoupon);
    } catch (error) {
      next(error);
    }
  }
}
