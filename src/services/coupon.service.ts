import { ProductRepository } from "../repositories/product.repository";

import Stripe from "stripe";
import { CouponToCreate, IAdminSubscriptionCoupon, ISubscriptionCoupon } from "../types/dtos/couponDtos";
import { CouponNotFound, PromotionCodeNotFound } from "../types/errors/coupon.errors";

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

  async createCoupon(couponData: CouponToCreate): Promise<IAdminSubscriptionCoupon> {
    const productStripeIds: string[] = []
    if (couponData.products) {
      const products = await this.productRepository.find({
        where: { $in: couponData.products }
      })
      products.map((p) => productStripeIds.push(p.stripeProductId))
    }


    const coupon = await this.stripe.coupons.create({
      duration: couponData.duration,
      name: couponData.name,
      percent_off: couponData.discount,
      applies_to: { products: productStripeIds },
      duration_in_months: couponData.durationInMonth
    })

    const promotionCode = await this.stripe.promotionCodes.create({
      code: couponData.code,
      expires_at: Math.floor(couponData.expirationDate.getTime() / 1000),
      coupon: coupon.id
    })

    const subscriptionCoupon: IAdminSubscriptionCoupon = {
      name: coupon.name || 'Réduction',
      code: promotionCode.code,
      promotionCodeId: promotionCode.id,
      couponId: coupon.id,
      reduction: coupon.percent_off ?? 0,
      reductionType: 'percentage',
      startDate: new Date(promotionCode.created * 1000),
      endDate: promotionCode.expires_at ? new Date(promotionCode.expires_at * 1000) : undefined,
      isActive: promotionCode.active,
      timesReedeemed: promotionCode.times_redeemed || 0,
      duration: coupon.duration,
      durationInMonths: coupon.duration === 'repeating' ? coupon.duration_in_months : undefined,
    };

    return subscriptionCoupon; 
  }

  async cancelPromotionCode(id: string): Promise<IAdminSubscriptionCoupon> {
    const updatedPromotionCode = await this.stripe.promotionCodes.update(id, {
      active: false
    });

    if (!updatedPromotionCode) {
      throw new PromotionCodeNotFound()
    }

    const coupon = await this.stripe.coupons.retrieve(
      typeof updatedPromotionCode.coupon === 'string'
        ? updatedPromotionCode.coupon
        : updatedPromotionCode.coupon.id
    );

    if (!coupon) {
      throw new CouponNotFound();
    }

    const subscriptionCoupon: IAdminSubscriptionCoupon = {
      name: coupon.name || 'Réduction',
      code: updatedPromotionCode.code,
      promotionCodeId: updatedPromotionCode.id,
      couponId: coupon.id,
      reduction: coupon.percent_off ?? 0,
      reductionType: 'percentage',
      startDate: new Date(updatedPromotionCode.created * 1000),
      endDate: updatedPromotionCode.expires_at ? new Date(updatedPromotionCode.expires_at * 1000) : undefined,
      isActive: updatedPromotionCode.active,
      timesReedeemed: updatedPromotionCode.times_redeemed || 0,
      duration: coupon.duration,
      durationInMonths: coupon.duration === 'repeating' ? coupon.duration_in_months : undefined,
    };

    return subscriptionCoupon; 
  }
}
