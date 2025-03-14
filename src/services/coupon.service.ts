import { CouponRepository } from "../repositories/coupon.repository";
import type { ICoupon } from "../models/coupon.model";
import { AppError } from "../utils/AppError";
import { CouponToCreate, CouponToModify } from "../types/dtos/couponDtos";
import { ProductRepository } from "../repositories/product.repository";

export class CouponService {
  private couponRepository: CouponRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.couponRepository = new CouponRepository();
    this.productRepository = new ProductRepository();
  }

  async getCoupons(): Promise<ICoupon[]> {
    return await this.couponRepository.findAll();
  }

  async createCoupon(couponData: CouponToCreate): Promise<ICoupon> {
    const productList: string[] = [];
    for (const productId in couponData.products) {
      const product = await this.productRepository.findOneBy({ id: productId });

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      productList.push(product._id);
    }

    couponData.products = productList;
    

    return await this.couponRepository.create(couponData);
  }

  async updateCoupon(id: string, couponData: CouponToModify): Promise<ICoupon> {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new AppError("Coupon not found", 404);
    }

    const updatedCoupon = await this.couponRepository.update(id, couponData);
    if (!updatedCoupon) {
      throw new AppError("Failed to update coupon", 500);
    }
    return updatedCoupon;
  }

  async deleteCoupon(id: string): Promise<void> {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new AppError("Coupon not found", 404);
    }


    for (const productToModify in coupon.products) {
      console.log('Product to modify', productToModify)
      const product = await this.productRepository.findOneBy({ _id: productToModify });

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      product.coupons.filter(oldCoupon => oldCoupon.id !== coupon.id)

      await product.save();
    }

    const result = await this.couponRepository.delete(id);
    if (!result) {
      throw new AppError("Failed to delete coupon", 500);
    }
  }
}
