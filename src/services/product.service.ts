import type { IProduct } from "../models/product.model";
import { ProductAlreadyExists, ProductNotFound, ProductCategoryNotFound, ProductUpdateFailed, ProductDeleteFailed } from "../types/errors/product.errors";
import { ProductPriced, ProductToCreate, ProductToModify, SearchProductCriteria, StripePriceData } from "../types/dtos/productDtos";
import { ProductRepository } from "../repositories/product.repository";
import { CategoryRepository } from "../repositories/category.repository";
import Stripe from "stripe";

export class ProductService {
  private productRepository: ProductRepository;
  private categoryRepository: CategoryRepository;
  private stripe: Stripe;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createProduct(productData: ProductToCreate): Promise<IProduct> {
    const existingProduct = await this.productRepository.findOneBy({ name: productData.name });
    if (existingProduct) {
      throw new ProductAlreadyExists();
    }

    const category = await this.categoryRepository.findOneBy({ id: productData.category });

    if (!category) {
      throw new ProductCategoryNotFound();
    }

    const product: Stripe.Product = await this.stripe.products.create({
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

    productData.stripeProductId = product.id;
    productData.stripePriceIdYearly = yearlyPrice.id;
    productData.stripePriceId = product.default_price?.toString();

    productData.category = category._id;

    return await this.productRepository.create(productData);
  }

  async getProduct(id: string): Promise<ProductPriced> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new ProductNotFound();
    }
    
    const stripePrice = await this.stripe.prices.list({
      product: product.stripeProductId,
      active: true,
    });

    const jsonStripePrice = JSON.stringify(stripePrice, null, 2)
    const parsableData = JSON.parse(jsonStripePrice).data;
    const yearlyPrice = parsableData.find((priceData: StripePriceData) => priceData.recurring.interval == "year").unit_amount / 100
    const monthlyPrice = parsableData.find((priceData: StripePriceData) => priceData.recurring.interval == "month").unit_amount / 100
    const productPriced = new ProductPriced(product, monthlyPrice, yearlyPrice)

    return productPriced;
  }

  async getProducts(searchCriteria: SearchProductCriteria): Promise<{ products: ProductPriced[]; total: number; pages: number }> {
    const { page = 1, limit = 10, ...filters } = searchCriteria;
    if (filters.category) {
      const category = await this.categoryRepository.findOneBy({ id: filters.category });
      if (!category) {
        throw new ProductCategoryNotFound();
      }
      filters.category = category._id;
    }

    const { products, total } = await this.productRepository.findBy(filters, page, limit);

    const productPricedList: ProductPriced[] = [];
    for (const product of products) {
      let monthlyPrice = 0;
      let yearlyPrice = 0;
      if (product.stripeProductId) {
        const stripePrice = await this.stripe.prices.list({
          product: product.stripeProductId,
          active: true,
        });
        const jsonStripePrice = JSON.stringify(stripePrice, null, 2)
        const parsableData = JSON.parse(jsonStripePrice).data;
        const foundYear = parsableData.find((priceData: StripePriceData) => priceData.recurring.interval == "year");
        const foundMonth = parsableData.find((priceData: StripePriceData) => priceData.recurring.interval == "month");

        if (foundYear.unit_amount && searchCriteria.minimumPrice && foundYear.unit_amount / 100 < searchCriteria.minimumPrice
          || foundMonth.unit_amount && searchCriteria.minimumPrice && foundMonth.unit_amount / 100 < searchCriteria.minimumPrice
          || foundYear.unit_amount && searchCriteria.maximumPrice && foundYear.unit_amount / 100 > searchCriteria.maximumPrice
          || foundMonth.unit_amount && searchCriteria.maximumPrice && foundMonth.unit_amount / 100 > searchCriteria.maximumPrice
        ) {
          continue;
        }

        yearlyPrice = foundYear ? foundYear.unit_amount / 100 : 0;
        monthlyPrice = foundMonth ? foundMonth.unit_amount / 100 : 0;
      }

      productPricedList.push(new ProductPriced(product, monthlyPrice, yearlyPrice));
    }

    const pages = Math.ceil(total / limit);
    return { products: productPricedList, total, pages };
  }


  async getTopProducts(): Promise<ProductPriced[]> {
    const sessions = await this.stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.line_items'],
      status: 'complete'
    });

    const productCounts: Record<string, number> = {};

    for (const session of sessions.data) {
      if (session.payment_status !== 'paid') continue;

      const lineItems = session.line_items?.data || [];

      for (const item of lineItems) {
        const productId = item.price?.product as string;
        if (productId) {
          productCounts[productId] = (productCounts[productId] || 0) + (item.quantity ?? 0);
        }
      }
    }

    const productIds = Object.keys(productCounts);
    if (productIds.length === 0) return [];

    const validProducts = await this.productRepository.find({
      stripeProductId: { $in: productIds }
    });

    const pricePromises = validProducts.map(product =>
      this.stripe.prices.list({
        product: product.stripeProductId!,
        active: true,
      })
    );

    const allPrices = await Promise.all(pricePromises);

    const productPricedList: ProductPriced[] = validProducts.map((product: IProduct, index: number) => {
      const prices = allPrices[index].data;

      const yearlyPrice = prices.find(p => p.recurring?.interval === "year");
      const monthlyPrice = prices.find(p => p.recurring?.interval === "month");

      return new ProductPriced(
        product,
        monthlyPrice?.unit_amount ? monthlyPrice.unit_amount / 100 : 0,
        yearlyPrice?.unit_amount ? yearlyPrice.unit_amount / 100 : 0,
        productCounts[product.stripeProductId!] || 0 
      );
    });

    return productPricedList;
  }


  async updateProduct(id: string, productData: ProductToModify): Promise<IProduct> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFound();
    }
    const updatedProduct = await this.productRepository.update(id, productData);
    if (!updatedProduct) {
      throw new ProductUpdateFailed();
    }
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFound();
    }
    const result = await this.productRepository.delete(id);
    if (!result) {
      throw new ProductDeleteFailed();
    }
  }

}