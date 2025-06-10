import type { IProduct } from "../models/product.model";
import { ProductAlreadyExists, ProductNotFound, ProductNegativePrice, ProductNegativeStock, ProductCategoryNotFound, ProductUpdateFailed, ProductDeleteFailed } from "../types/errors/product.errors";
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

    if (productData.monthlyPrice < 0) {
      throw new ProductNegativePrice();
    }

    if (productData.yearlyPrice < 0) {
      throw new ProductNegativeStock();
    }

    const category = await this.categoryRepository.findOneBy({ id: productData.category });

    if (!category) {
      throw new ProductCategoryNotFound();
    }

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
        yearlyPrice = foundYear ? foundYear.unit_amount / 100 : 0;
        monthlyPrice = foundMonth ? foundMonth.unit_amount / 100 : 0;
      }
      productPricedList.push(new ProductPriced(product, monthlyPrice, yearlyPrice));
    }

    const pages = Math.ceil(total / limit);
    return { products: productPricedList, total, pages };
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