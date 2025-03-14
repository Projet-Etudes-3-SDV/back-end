import Coupon, { type ICoupon } from "../models/coupon.model";
import { CouponToCreate, CouponToModify } from "../types/dtos/couponDtos";

export class CouponRepository {
  async create(couponData: CouponToCreate): Promise<ICoupon> {
    const coupon = new Coupon(couponData);
    return await coupon.save();
  }

  async findAll(): Promise<ICoupon[]> {
    return await Coupon.find().populate("Product");
  }

  async findById(id: string): Promise<ICoupon | null> {
    return await Coupon.findOne({ id }).populate("Product");
  }

  async update(id: string, couponData: CouponToModify): Promise<ICoupon | null> {
    return await Coupon.findOneAndUpdate({ id }, couponData, { new: true }).populate("Product");
  }

  async delete(id: string): Promise<boolean> {
    const result = await Coupon.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
