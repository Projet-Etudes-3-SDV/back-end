// import { CouponToCreate, CouponToModify } from "../types/dtos/couponDtos";
import { ProductRepository } from "../repositories/product.repository";
// import { CouponNotFound, CouponUpdateFailed, CouponDeleteFailed } from "../types/errors/coupon.errors";
// import { ProductNotFound } from "../types/errors/product.errors";

import Stripe from "stripe";
import { IAdminSubscriptionCoupon, ISubscriptionCoupon } from "../types/dtos/couponDtos";

export class CouponService {
  private productRepository: ProductRepository;
  private stripe: Stripe;

  constructor() {
    this.productRepository = new ProductRepository();
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-02-24.acacia',
    });  }

  async getCoupons(): Promise<ISubscriptionCoupon[]> {
    const stripeCoupons = await this.stripe.promotionCodes.list();
    const coupons: ISubscriptionCoupon[] = stripeCoupons.data.map((promotionCode: Stripe.PromotionCode) => {
      let reduction: number;
      let reductionType: 'percentage' | 'fixed';
      const discount = promotionCode.coupon;
      if (discount.percent_off) {
        reduction = discount.percent_off;
        reductionType = 'percentage';
      } else if (discount.amount_off) {
        reduction = discount.amount_off;
        reductionType = 'fixed';
      } else {
        reduction = 0;
        reductionType = 'fixed';
      }
      
      const subscriptionCoupon: IAdminSubscriptionCoupon = {
        name: discount.name || 'Réduction',
        code: promotionCode.code,
        promotionCodeId: promotionCode.id,
        couponId: discount.id,        
        reduction,
        reductionType,
        startDate: new Date(promotionCode.created * 1000),
        endDate: promotionCode.expires_at ? new Date(promotionCode.expires_at * 1000) : undefined,
        isActive: promotionCode.active,
        timesReedeemed: promotionCode.times_redeemed || 0,
        duration: discount.duration,
        durationInMonths: discount.duration === 'repeating' ? discount.duration_in_months : undefined,
      };
      return subscriptionCoupon;
    });

  
    return coupons;
  }

  async createCoupon(): Promise<Stripe.Coupon> {
    return (await this.stripe.coupons.create({
      duration: "once",
      name: "First",
      percent_off: 10
    })) as Stripe.Coupon
  }

  // async updateCoupon(id: string, couponData: CouponToModify): Promise<ICoupon> {
  //   const coupon = await this.couponRepository.findById(id);
  //   if (!coupon) {
  //     throw new CouponNotFound();
  //   }

  //   const updatedCoupon = await this.couponRepository.update(id, couponData);
  //   if (!updatedCoupon) {
  //     throw new CouponUpdateFailed();
  //   }
  //   return updatedCoupon;
  // }

  // async deleteCoupon(id: string): Promise<void> {
  //   const coupon = await this.couponRepository.findById(id);
  //   if (!coupon) {
  //     throw new CouponNotFound();
  //   }

  //   for (const productToModify in coupon.products) {
  //     console.log('Product to modify', productToModify)
  //     const product = await this.productRepository.findOneBy({ _id: productToModify });

  //     if (!product) {
  //       throw new ProductNotFound();
  //     }

  //     product.coupons.filter(oldCoupon => oldCoupon.id !== coupon.id)

  //     await product.save();
  //   }

  //   const result = await this.couponRepository.delete(id);
  //   if (!result) {
  //     throw new CouponDeleteFailed();
  //   }
  // }
}
