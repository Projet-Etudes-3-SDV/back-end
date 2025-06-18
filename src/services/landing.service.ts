import { LandingRepository } from "../repositories/landing.repository";
import { ILanding, LandingWithPricedProducts, PricedCarouselProduct } from "../models/landing.model";
import { LandingToCreate, LandingToModify } from "../types/requests/landing.requests";
import Product, { IProduct } from "../models/product.model"; // Import the Product model
import { AppError } from "../utils/AppError"; // Import AppError for error handling
import { ObjectId } from "mongoose";
import { MainLandingExists } from "../types/errors/landing.errors";
import Stripe from "stripe";
import { IPriceService, StripePriceService } from "./price.service";
import { ProductPriced } from "../types/pojos/product-priced.pojo";
import { CategoryRepository } from "../repositories/category.repository";
import { ICategory } from "../models/category.model";

export class LandingService {
  private landingRepository: LandingRepository;
  private priceService: IPriceService;
  private categoryRepository: CategoryRepository;
  constructor() {
    this.landingRepository = new LandingRepository();
    this.categoryRepository = new CategoryRepository();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-02-24.acacia',
    });

    this.priceService = new StripePriceService(stripe);
  }

  async createLanding(data: LandingToCreate): Promise<ILanding> {
    if (data.carouselSection.products.length > 0) {
      const products = data.carouselSection.products.map((product) => product.product);
      const productIds = await this.verifyProductsExist(products);

      data.carouselSection.products = data.carouselSection.products.map((product) => ({
        product: productIds.find((p) => p.id === product.product)?._id || "",
        order: product.order
      }));

      await this.verifyUniqueProductOrder(data.carouselSection.products);
    }
    if (
      data.carouselSection.order !== undefined &&
      data.categorySection.order !== undefined && 
      data.alert?.order !== undefined
    ) {
      await this.verifySectionOrderUniqueness(data.carouselSection.order, data.categorySection.order, data.alert?.order);
    }

    if (data.isMain === true) {
      const existingMainLanding = await this.landingRepository.findMainLanding();
      if (existingMainLanding) {
        existingMainLanding.isMain = false;
        await this.landingRepository.update(existingMainLanding.id, existingMainLanding);
      }
    } else if (data.isMain === false) {
      const existingMainLanding = await this.landingRepository.findMainLanding();
      if (!existingMainLanding) {
        data.isMain = true;
      }
    }

    return await this.landingRepository.create(data);
  }

  async getLandingById(id: string): Promise<LandingWithPricedProducts | null> {
    const landing = await this.verifyLandingExists(id);

    const { categories } = await this.categoryRepository.findBy({}, 1, 5);

    return await this.enrichLandingWithPrices(landing, categories);
  }

  async getMainLanding(): Promise<LandingWithPricedProducts | null> {
    const landing = await this.landingRepository.findMainLanding();
    if (!landing) {
      throw new AppError("Main landing not found", 404, [], "MAIN_LANDING_NOT_FOUND");
    }
    const { categories } = await this.categoryRepository.findBy({}, 1, 5);
    return await this.enrichLandingWithPrices(landing, categories);
  }

  async getAllLandings(page: number, limit: number): Promise<{ landings: LandingWithPricedProducts[]; total: number }> {
    const { landings, total } = await this.landingRepository.findAll(page, limit);
    const { categories } = await this.categoryRepository.findBy({}, 1, 5);

    const enrichedLandings = await Promise.all(
      landings.map(landing => this.enrichLandingWithPrices(landing, categories))
    );

    return { landings: enrichedLandings, total };
  }

  async updateLanding(id: string, data: LandingToModify): Promise<LandingWithPricedProducts | null> {
    await this.verifyLandingExists(id);
    if (data.carouselSection?.products && data.carouselSection.products.length > 0) {
      const products = data.carouselSection.products.map((product) => product.product);
      const productIds = await this.verifyProductsExist(products);

      data.carouselSection.products = data.carouselSection.products.map((product) => ({
        product: productIds.find((p) => p.id === product.product)?._id || "",
        order: product.order
      }));

      await this.verifyUniqueProductOrder(data.carouselSection.products);
    }
    if (
      data.carouselSection?.order !== undefined &&
      data.categorySection?.order !== undefined
    ) {
      await this.verifySectionOrderUniqueness(data.carouselSection.order, data.categorySection.order);
    }

    if (data.isMain) {
      const existingMainLanding = await this.landingRepository.findMainLanding();
      if (!existingMainLanding) {
        throw new MainLandingExists()
      }
      existingMainLanding.isMain = false;
      await this.landingRepository.update(existingMainLanding.id, existingMainLanding);
    }

    const updatedLanding = await this.landingRepository.update(id, data);
    if (!updatedLanding) {
      return null;
    }
    const { categories } = await this.categoryRepository.findBy({}, 1, 5);
    return await this.enrichLandingWithPrices(updatedLanding, categories);
  }

  async deleteLanding(id: string): Promise<boolean> {
    await this.verifyLandingExists(id);
    return await this.landingRepository.delete(id);
  }
  private async verifyProductsExist(productIds: (string | ObjectId)[]): Promise<LandingIDs[]> {
    const existingProducts = await Product.find({ id: { $in: productIds } });
    if (existingProducts.length !== productIds.length) {
      throw new AppError("Some products do not exist", 400, [], "INVALID_PRODUCTS");
    }

    return existingProducts.map((product) => ({ _id: product._id, id: product.id }));
  }


  // ---------- UTILS ---------- \\

  private async verifyLandingExists(id: string): Promise<ILanding> {
    const landing = await this.landingRepository.findById(id);
    if (!landing) {
      throw new AppError("Landing not found", 404, [], "LANDING_NOT_FOUND");
    }
    return landing;
  }

  private async verifyUniqueProductOrder(products: { product: string | ObjectId; order: number }[]): Promise<void> {
    const orders = products.map((p) => p.order);
    const uniqueOrders = new Set(orders);
    if (orders.length !== uniqueOrders.size) {
      throw new AppError("Product orders must be unique", 400, [], "DUPLICATE_PRODUCT_ORDER");
    }
  }

  private async verifySectionOrderUniqueness(carouselOrder: number, categoryOrder: number, alertOrder?: number): Promise<void> {
    if (carouselOrder === categoryOrder) {
      throw new AppError("Carousel section order and category section order must be unique", 400, [], "DUPLICATE_SECTION_ORDER");
    }
    if (alertOrder !== undefined && (carouselOrder === alertOrder || categoryOrder === alertOrder)) {
      throw new AppError("Section order must be unique across all sections", 400, [], "DUPLICATE_SECTION_ORDER");
    }
  }


  private async enrichLandingWithPrices(landing: ILanding, categories: ICategory[]): Promise<LandingWithPricedProducts> {
    if (!landing.carouselSection?.products || landing.carouselSection.products.length === 0) {
      return new LandingWithPricedProducts(landing, [], categories);
    }

    const pricedProducts = await Promise.all(
      landing.carouselSection.products.map(async (carouselProduct) => {
        const product = await Product.findById(carouselProduct.product).populate('category');
        if (!product) {
          throw new AppError("Product not found in carousel", 404, [], "CAROUSEL_PRODUCT_NOT_FOUND");
        }
        const productPriced = await this.createProductPricedWithPrices(product);

        const pricedCarouselProduct: PricedCarouselProduct = {
          product: productPriced,
          order: carouselProduct.order
        };

        return pricedCarouselProduct;
      })
    );
    pricedProducts.sort((a, b) => a.order - b.order);

    return new LandingWithPricedProducts(landing, pricedProducts, categories);
  }

  private async createProductPricedWithPrices(product: IProduct): Promise<ProductPriced> {
    if (!product.stripeProductId) {
      return new ProductPriced(product, 0, 0);
    }

    try {
      const { monthlyPrice, yearlyPrice, freeTrialDays } = await this.priceService.getPricesForProduct(product.stripeProductId);
      return new ProductPriced(product, monthlyPrice, yearlyPrice, freeTrialDays);
    } catch (error) {
      console.error(`Error fetching prices for product ${product.id}:`, error);
      return new ProductPriced(product, 0, 0);
    }
  }
}

class LandingIDs {
  id!: string;
  _id!: ObjectId;
}