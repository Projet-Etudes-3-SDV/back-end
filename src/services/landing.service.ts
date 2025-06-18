import { LandingRepository } from "../repositories/landing.repository";
import { ILanding, LandingWithPricedProducts, PricedCarouselProduct } from "../models/landing.model";
import { LandingToCreate, LandingToModify } from "../types/requests/landing.requests";
import Product, { IProduct } from "../models/product.model";
import { ObjectId } from "mongoose";
import { LandingNotFound, MainLandingNotFound, DuplicateProductOrder, DuplicateCategoryOrder, DuplicateSectionOrder, CarouselProductNotFound } from "../types/errors/landing.errors";
import Stripe from "stripe";
import { IPriceService, StripePriceService } from "./price.service";
import { ProductPriced } from "../types/pojos/product-priced.pojo";
import { ProductNotFound } from "../types/errors/product.errors";
import { CategoryNotFound } from "../types/errors/category.errors";
import Category from "../models/category.model";

export class LandingService {
  private landingRepository: LandingRepository;
  private priceService: IPriceService;
  constructor() {
    this.landingRepository = new LandingRepository();
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
    if (data.categorySection.categories.length > 0) {
      const categories = data.categorySection.categories.map((category) => category.category);
      const categoryIds = await this.verifyCategoriesExist(categories);

      data.categorySection.categories = data.categorySection.categories.map((category) => ({
        category: categoryIds.find((c) => c.id === category.category)?._id || "",
        order: category.order
      }));

      await this.verifyUniqueCategoriesOrder(data.categorySection.categories);
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


    return await this.enrichLandingWithPrices(landing);
  }

  async getMainLanding(): Promise<LandingWithPricedProducts | null> {
    const landing = await this.landingRepository.findMainLanding();
    if (!landing) {
      throw new MainLandingNotFound();
    }
    return await this.enrichLandingWithPrices(landing);
  }

  async getAllLandings(page: number, limit: number): Promise<{ landings: LandingWithPricedProducts[]; total: number }> {
    const { landings, total } = await this.landingRepository.findAll(page, limit);

    const enrichedLandings = await Promise.all(
      landings.map(landing => this.enrichLandingWithPrices(landing))
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

    if (data.categorySection?.categories && data.categorySection.categories.length > 0) {
      const categories = data.categorySection.categories.map((category) => category.category);
      const categoryIds = await this.verifyCategoriesExist(categories);

      data.categorySection.categories = data.categorySection.categories.map((category) => ({
        category: categoryIds.find((c) => c.id === category.category)?._id || "",
        order: category.order
      }));

      await this.verifyUniqueCategoriesOrder(data.categorySection.categories);
    }

    if (
      data.carouselSection?.order !== undefined &&
      data.categorySection?.order !== undefined
    ) {
      await this.verifySectionOrderUniqueness(data.carouselSection.order, data.categorySection.order, data.alert?.order);
    }

    if (data.isMain) {
      const existingMainLanding = await this.landingRepository.findMainLanding();
      if (existingMainLanding && existingMainLanding.id !== id) { // CORRECTION : éviter de se désactiver soi-même
        existingMainLanding.isMain = false;
        await this.landingRepository.update(existingMainLanding.id, existingMainLanding);
      }
    }

    const updatedLanding = await this.landingRepository.update(id, data);
    if (!updatedLanding) {
      return null;
    }

    return await this.enrichLandingWithPrices(updatedLanding);
  }

  async deleteLanding(id: string): Promise<boolean> {
    await this.verifyLandingExists(id);
    return await this.landingRepository.delete(id);
  }

  // ---------- UTILS ---------- \\

  private async verifyProductsExist(productIds: (string | ObjectId)[]): Promise<LandingIDs[]> {
    const existingProducts = await Product.find({ id: { $in: productIds } });
    if (existingProducts.length !== productIds.length) {
      throw new ProductNotFound();
    }

    return existingProducts.map((product) => ({ _id: product._id, id: product.id }));
  }

  private async verifyCategoriesExist(productIds: (string | ObjectId)[]): Promise<LandingIDs[]> {
    const existingCategories = await Category.find({ id: { $in: productIds } });
    if (existingCategories.length !== productIds.length) {
      throw new CategoryNotFound();
    }

    return existingCategories.map((category) => ({ _id: category._id, id: category.id }));
  }

  private async verifyLandingExists(id: string): Promise<ILanding> {
    const landing = await this.landingRepository.findById(id);
    if (!landing) {
      throw new LandingNotFound();
    }
    return landing;
  }

  private async verifyUniqueProductOrder(products: { product: string | ObjectId; order: number }[]): Promise<void> {
    const orders = products.map((p) => p.order);
    const uniqueOrders = new Set(orders);
    if (orders.length !== uniqueOrders.size) {
      throw new DuplicateProductOrder();
    }
  }

  private async verifyUniqueCategoriesOrder(categories: { category: string | ObjectId; order: number }[]): Promise<void> {
    const orders = categories.map((c) => c.order);
    const uniqueOrders = new Set(orders);
    if (orders.length !== uniqueOrders.size) {
      throw new DuplicateCategoryOrder();
    }
  }

  private async verifySectionOrderUniqueness(carouselOrder: number, categoryOrder: number, alertOrder?: number): Promise<void> {
    if (carouselOrder === categoryOrder) {
      throw new DuplicateSectionOrder();
    }
    if (alertOrder !== undefined && (carouselOrder === alertOrder || categoryOrder === alertOrder)) {
      throw new DuplicateSectionOrder();
    }
  }


  private async enrichLandingWithPrices(landing: ILanding): Promise<LandingWithPricedProducts> {
    if (!landing.carouselSection?.products || landing.carouselSection.products.length === 0) {
      return new LandingWithPricedProducts(landing, []);
    }

    const pricedProducts = await Promise.all(
      landing.carouselSection.products.map(async (carouselProduct) => {
        const product = await Product.findById(carouselProduct.product).populate('category');
        if (!product) {
          throw new CarouselProductNotFound();
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

    return new LandingWithPricedProducts(landing, pricedProducts);
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