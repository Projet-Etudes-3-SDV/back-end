import LandingSchema, { ILanding } from "../models/landing.model";
import { LandingToCreate, LandingToModify } from "../types/requests/landing.requests";

export class LandingRepository {
  async create(landingData: LandingToCreate): Promise<ILanding> {
    const landing = new LandingSchema(landingData);
    const created = await landing.save();
    return await this.findById(created.id) || created;
  }

  async findById(id: string): Promise<ILanding | null> {
    return await LandingSchema.findOne({ id }).populate([
      {
        path: "carouselSection.products.product",
        model: "Product",
        populate: {
          path: "category",
          model: "Category",
        },
      },
      {
        path: "categorySection.categories.category",
        model: "Category",
      }
    ]);
  }

  async findMainLanding(): Promise<ILanding | null> {
    return await LandingSchema.findOne({ isMain: true }).populate([
      {
        path: "carouselSection.products.product",
        model: "Product",
        populate: {
          path: "category",
          model: "Category",
        }
      },
      {
        path: "categorySection.categories.category",
        model: "Category",
      }
    ]);
  }

  async findAll(page: number, limit: number): Promise<{ landings: ILanding[]; total: number }> {
    const skip = (page - 1) * limit;
    const [landings, total] = await Promise.all([
      LandingSchema.find().skip(skip).limit(limit).populate([
        {
          path: "carouselSection.products.product",
          model: "Product",
          populate: {
            path: "category",
            model: "Category",
          }
        },
        {
          path: "categorySection.categories.category",
          model: "Category",
        }
      ]),
      LandingSchema.countDocuments(),
    ]);
    return { landings, total };
  }

  async update(id: string, landingData: Partial<LandingToModify>): Promise<ILanding | null> {
    return await LandingSchema.findOneAndUpdate({ id }, landingData, { new: true }).populate([
      {
        path: "carouselSection.products.product",
        model: "Product",
        populate: {
          path: "category",
          model: "Category",
        }
      },
      {
        path: "categorySection.categories.category",
        model: "Category",
      }
    ]);
  }

  async delete(id: string): Promise<boolean> {
    const result = await LandingSchema.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
