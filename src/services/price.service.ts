import Stripe from "stripe";
import { ProductToCreate } from "../types/dtos/productDtos";

// Interface pour abstraire les opérations de pricing Stripe
export interface IPriceService {
  createProductWithPrices(productData: ProductToCreate): Promise<{ stripeProductId: string; stripePriceId: string; stripePriceIdYearly: string }>;
  getPricesForProduct(stripeProductId: string): Promise<{ monthlyPrice: number; yearlyPrice: number }>;
  updateProductInfo(stripeProductId: string, name?: string, description?: string, active?: boolean): Promise<boolean>;
  createPrice(stripeProductId: string, amount: number, interval: 'month' | 'year'): Promise<string>;
}

// Classe dédiée aux opérations de pricing Stripe
export class StripePriceService implements IPriceService {
  constructor(private stripe: Stripe) { }

  async createProductWithPrices(productData: ProductToCreate): Promise<{ stripeProductId: string; stripePriceId: string; stripePriceIdYearly: string }> {
    const product = await this.stripe.products.create({
      name: productData.name,
      description: productData.description,
      default_price_data: {
        currency: 'eur',
        unit_amount: productData.monthlyPrice * 100,
        recurring: { interval: 'month' },
      }
    });

    const yearlyPrice = await this.stripe.prices.create({
      product: product.id,
      unit_amount: productData.yearlyPrice * 100,
      currency: 'eur',
      recurring: { interval: 'year' },
    });

    return {
      stripeProductId: product.id,
      stripePriceId: product.default_price?.toString() || '',
      stripePriceIdYearly: yearlyPrice.id
    };
  }

  async getPricesForProduct(stripeProductId: string): Promise<{ monthlyPrice: number; yearlyPrice: number }> {
    const stripePrice = await this.stripe.prices.list({
      product: stripeProductId,
      active: true,
    });

    const prices = stripePrice.data;
    const yearly = prices.find((priceData: Stripe.Price) => priceData.recurring?.interval === "year");
    const monthly = prices.find((priceData: Stripe.Price) => priceData.recurring?.interval === "month");
    const yearlyPrice = yearly && yearly.unit_amount != null ? yearly.unit_amount / 100 : 0;
    const monthlyPrice = monthly && monthly.unit_amount != null ? monthly.unit_amount / 100 : 0;

    return { monthlyPrice, yearlyPrice };
  }

  async updateProductInfo(stripeProductId: string, name?: string, description?: string, active?: boolean): Promise<boolean> {
    const product = await this.stripe.products.update(stripeProductId, {
      ...(name && { name }),
      ...(description && { description }),
      ...(active !== undefined && { active }),
    });

    return product ? true : false
  }

  async createPrice(stripeProductId: string, amount: number, interval: 'month' | 'year'): Promise<string> {
    const price = await this.stripe.prices.create({
      product: stripeProductId,
      unit_amount: amount * 100,
      currency: 'eur',
      recurring: { interval },
    });
    return price.id;
  }
}