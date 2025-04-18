import { LandingRepository } from "../repositories/landing.repository";
import { ILanding } from "../models/landing.model";
import { LandingToCreate, LandingToModify } from "../types/dtos/landingDtos";
import Product from "../models/product.model"; // Import the Product model
import { AppError } from "../utils/AppError"; // Import AppError for error handling
import { ObjectId } from "mongoose";

export class LandingService {
  private landingRepository: LandingRepository;

  constructor() {
    this.landingRepository = new LandingRepository();
  }

  async createLanding(data: LandingToCreate): Promise<ILanding> {
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
    return await this.landingRepository.create(data);
  }

  async getLandingById(id: string): Promise<ILanding | null> {
    return await this.verifyLandingExists(id);
  }

  async getAllLandings(page: number, limit: number): Promise<{ landings: ILanding[]; total: number }> {
    return await this.landingRepository.findAll(page, limit);
  }

  async updateLanding(id: string, data: LandingToModify): Promise<ILanding | null> {
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
    return await this.landingRepository.update(id, data);
  }

  async deleteLanding(id: string): Promise<boolean> {
    await this.verifyLandingExists(id);
    return await this.landingRepository.delete(id);
  }

  // ------------ UTILITY FUNCTIONS ------------

  private async verifyProductsExist(productIds: (string | ObjectId)[]): Promise<LandingIDs[]> {
    const existingProducts = await Product.find({ id: { $in: productIds } });
    if (existingProducts.length !== productIds.length) {
      throw new AppError("Some products do not exist", 400, [], "INVALID_PRODUCTS");
    }

    return existingProducts.map((product) => ({ _id: product._id, id: product.id }));
  }

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

  private async verifySectionOrderUniqueness(carouselOrder: number, categoryOrder: number): Promise<void> {
    if (carouselOrder === categoryOrder) {
      throw new AppError("Carousel section order and category section order must be unique", 400, [], "DUPLICATE_SECTION_ORDER");
    }
  }

  }
  
class LandingIDs {
  id!: string;
  _id!: ObjectId;
}

