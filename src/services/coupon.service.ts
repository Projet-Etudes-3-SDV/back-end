import { CouponRepository } from "../repositories/coupon.repository";
import type { ICoupon } from "../models/coupon.model";
import { CouponToCreate, CouponToModify } from "../types/dtos/couponDtos";
import { ProductRepository } from "../repositories/product.repository";
import { CouponNotFound, CouponUpdateFailed, CouponDeleteFailed } from "../types/errors/coupon.errors";
import { ProductNotFound } from "../types/errors/product.errors";

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
        throw new ProductNotFound();
      }

      productList.push(product._id);
    }

    couponData.products = productList;

    return await this.couponRepository.create(couponData);
  }

  async updateCoupon(id: string, couponData: CouponToModify): Promise<ICoupon> {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new CouponNotFound();
    }

    const updatedCoupon = await this.couponRepository.update(id, couponData);
    if (!updatedCoupon) {
      throw new CouponUpdateFailed();
    }
    return updatedCoupon;
  }

  async deleteCoupon(id: string): Promise<void> {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new CouponNotFound();
    }

    for (const productToModify in coupon.products) {
      console.log('Product to modify', productToModify)
      const product = await this.productRepository.findOneBy({ _id: productToModify });

      if (!product) {
        throw new ProductNotFound();
      }

      product.coupons.filter(oldCoupon => oldCoupon.id !== coupon.id)

      await product.save();
    }

    const result = await this.couponRepository.delete(id);
    if (!result) {
      throw new CouponDeleteFailed();
    }
  }
}
