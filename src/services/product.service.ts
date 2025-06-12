import type { IProduct } from "../models/product.model";
import { ProductAlreadyExists, ProductNotFound, ProductCategoryNotFound, ProductUpdateFailed, ProductDeleteFailed, ProductSearchPriceRangeInvalid } from "../types/errors/product.errors";
import { ProductPriced, ProductToCreate, ProductToModify, ProductToModifyDTO, SearchProductCriteria, SortProductCriteria } from "../types/dtos/productDtos";
import { ProductRepository } from "../repositories/product.repository";
import { CategoryRepository } from "../repositories/category.repository";
import Stripe from "stripe";
import { plainToClass } from "class-transformer";
import { IPriceService, StripePriceService } from "./price.service";

// Factory pour créer ProductPriced
class ProductPricedFactory {
  static create(product: IProduct, monthlyPrice: number = 0, yearlyPrice: number = 0): ProductPriced {
    return new ProductPriced(product, monthlyPrice, yearlyPrice);
  }

  static async createWithPrices(product: IProduct, priceService: IPriceService): Promise<ProductPriced> {
    if (!product.stripeProductId) {
      return this.create(product, 0, 0);
    }

    const { monthlyPrice, yearlyPrice } = await priceService.getPricesForProduct(product.stripeProductId);
    return this.create(product, monthlyPrice, yearlyPrice);
  }
}

export class ProductService {
  private productRepository: ProductRepository;
  private categoryRepository: CategoryRepository;
  private priceService: IPriceService;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-02-24.acacia',
    });

    this.priceService = new StripePriceService(stripe);
  }

  async createProduct(productData: ProductToCreate): Promise<IProduct> {
    await this.validateProductCreation(productData);

    const category = await this.getCategoryById(productData.category);
    const stripeData = await this.priceService.createProductWithPrices(productData);

    const productToCreate = {
      ...productData,
      ...stripeData,
      category: category._id
    };

    return await this.productRepository.create(productToCreate);
  }

  async getProduct(id: string): Promise<ProductPriced> {
    const product = await this.findProductById(id);
    return await ProductPricedFactory.createWithPrices(product, this.priceService);
  }

  async getProducts(searchCriteria: SearchProductCriteria, sortCriteria: SortProductCriteria): Promise<{ products: ProductPriced[]; total: number; pages: number }> {
    const { page = 1, limit = 10, ...filters } = searchCriteria;

    if (filters.category) {
      const category = await this.getCategoryById(filters.category);
      filters.category = category._id;
    }

    const { products, total } = await this.productRepository.findBy(filters, page, limit, sortCriteria);
    const filteredProducts = await this.filterProductsByPrice(products, searchCriteria, sortCriteria);

    const pages = Math.ceil(total / limit);
    return { products: filteredProducts, total, pages };
  }

  async updateProduct(id: string, productData: ProductToModifyDTO): Promise<IProduct> {
    const product = await this.findProductById(id);

    const isUpdated = await this.updateStripeProduct(product, productData);
    if (!isUpdated) {
      throw new ProductUpdateFailed();
    }

    const updatedPriceIds = await this.updateProductPrices(product.stripeProductId, productData);

    const productToModify = plainToClass(ProductToModify, { ...productData, ...updatedPriceIds }, { excludeExtraneousValues: true });

    const updatedProduct = await this.productRepository.update(id, productToModify);
    if (!updatedProduct) {
      throw new ProductUpdateFailed();
    }
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.findProductById(id);

    if (!product.stripeProductId) {
      throw new ProductNotFound();
    }

    const isUpdated = await this.updateStripeProduct(product, { active: false });
    if (!isUpdated) {
      throw new ProductUpdateFailed();
    }

    product.active = false;

    const deletedProduct = await this.productRepository.update(id, product);
    if (!deletedProduct) {
      throw new ProductDeleteFailed();
    }
  }

  private async validateProductCreation(productData: ProductToCreate): Promise<void> {
    const existingProduct = await this.productRepository.findOneBy({ name: productData.name });
    if (existingProduct) {
      throw new ProductAlreadyExists();
    }
  }

  private async getCategoryById(categoryId: string) {
    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      throw new ProductCategoryNotFound();
    }
    return category;
  }

  private async findProductById(id: string): Promise<IProduct> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new ProductNotFound();
    }
    return product;
  }

  private async filterProductsByPrice(products: IProduct[], searchCriteria: SearchProductCriteria, sortCriteria: SortProductCriteria): Promise<ProductPriced[]> {
    let productPricedList: ProductPriced[] = [];

    if (searchCriteria.minimumPrice && searchCriteria.maximumPrice && searchCriteria.minimumPrice > searchCriteria.maximumPrice) {
      throw new ProductSearchPriceRangeInvalid();
    }

    for (const product of products) {
      if (!product.stripeProductId) {
        productPricedList.push(ProductPricedFactory.create(product));
        continue;
      }

      const { monthlyPrice, yearlyPrice } = await this.priceService.getPricesForProduct(product.stripeProductId);

      const foundYear = { unit_amount: yearlyPrice * 100, recurring: { interval: 'year' as const } };
      const foundMonth = { unit_amount: monthlyPrice * 100, recurring: { interval: 'month' as const } };

      if (!ProductValidator.validatePriceFilters(foundYear, foundMonth, searchCriteria.isYearlyPrice, searchCriteria.minimumPrice, searchCriteria.maximumPrice)) {
        continue;
      }

      productPricedList.push(ProductPricedFactory.create(product, monthlyPrice, yearlyPrice));
    }

    if (sortCriteria.sortBy === 'monthlyPrice' || sortCriteria.sortBy === 'yearlyPrice') {
      productPricedList = productPricedList.sort((a, b) => {
        let aValue: number, bValue: number;
        if (sortCriteria.sortBy === 'monthlyPrice') {
          aValue = a.monthlyPrice;
          bValue = b.monthlyPrice;
        } else if (sortCriteria.sortBy === 'yearlyPrice') {
          aValue = a.yearlyPrice;
          bValue = b.yearlyPrice;
        } else {
          aValue = 0;
          bValue = 0;
        }

        if (sortCriteria.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return productPricedList;
  }

  private async updateStripeProduct(product: IProduct, productData: ProductToModifyDTO): Promise<boolean> {
    if (productData.name || productData.description || productData.active !== undefined) {
      return await this.priceService.updateProductInfo(product.stripeProductId, productData.name, productData.description, productData.active);
    }
    return true
  }

  private async updateProductPrices(stripeProductId: string, productData: ProductToModifyDTO): Promise<Partial<{ stripePriceId: string; stripePriceIdYearly: string }>> {
    const updatedPriceIds: Partial<{ stripePriceId: string; stripePriceIdYearly: string }> = {};

    if (productData.monthlyPrice) {
      updatedPriceIds.stripePriceId = await this.priceService.createPrice(stripeProductId, productData.monthlyPrice, 'month');
    }

    if (productData.yearlyPrice) {
      updatedPriceIds.stripePriceIdYearly = await this.priceService.createPrice(stripeProductId, productData.yearlyPrice, 'year');
    }

    return updatedPriceIds;
  }
}
class ProductValidator {
  static validatePriceFilters(
    foundYear: IPriceInterval | undefined,
    foundMonth: IPriceInterval | undefined,
    isYearlyPrice: boolean,
    minimumPrice?: number,
    maximumPrice?: number
  ): boolean {
    if (!foundYear && !foundMonth) return true;

    const yearlyAmount = foundYear?.unit_amount ? foundYear.unit_amount / 100 : Infinity;
    const monthlyAmount = foundMonth?.unit_amount ? foundMonth.unit_amount / 100 : Infinity;


    if (!isYearlyPrice && (minimumPrice &&  monthlyAmount < minimumPrice)) {
      return false;
    }
    if (!isYearlyPrice && (maximumPrice && monthlyAmount > maximumPrice)) {
      return false;
    }

    if (isYearlyPrice && (minimumPrice && yearlyAmount < minimumPrice)) {
      return false;
    }

    if (isYearlyPrice && (maximumPrice && yearlyAmount > maximumPrice)) {
      return false;
    }

    return true;
  }
}

interface IPriceInterval {
  unit_amount: number;
  recurring: { interval: 'month' | 'year' };
}