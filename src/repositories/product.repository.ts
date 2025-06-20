import { FilterQuery } from "mongoose";
import Product, { type IProduct } from "../models/product.model";
import { ProductToCreate } from "../types/requests/product.requests";
import { AdminSearchProductCriteria } from "../types/filters/product.filters";
import { SortProductCriteria } from "../types/sorts/product.sorts";

export class ProductRepository {
  async create(userData: ProductToCreate): Promise<IProduct> {
    const product = new Product(userData);
    return (await  (await product.save()).populate("category")).populate("features");
  }

  async findById(id: string): Promise<IProduct | null> {
    return await Product.findOne({ id }).populate("category").populate("features");
  }

  async findOneBy(filters: FilterQuery<AdminSearchProductCriteria>): Promise<IProduct | null> {
    const query: FilterQuery<AdminSearchProductCriteria> = {};
    if (filters.name) query.name = { $regex: filters.name, $options: "i" };
    if (filters.available) query.available = filters.available;
    if (filters.monthlyPrice) query.monthlyPrice = filters.monthlyPrice;
    if (filters.yearlyPrice) query.yearlyPrice = filters.yearlyPrice;
    if (filters.category) query.category = filters.category;
    if (filters.id) query.id = filters.id;
    if (filters.stripePriceId) query.stripePriceId = filters.stripePriceId;
    if (filters.stripePriceIdYearly) query.stripePriceIdYearly = filters.stripePriceIdYearly;
    if (filters.stripeProductId) query.stripeProductId = filters.stripeProductId;

    
    if (!query) {
      return null;
    }

    return await Product.findOne(query).populate("category");
  }

  async findBy(filters: Partial<AdminSearchProductCriteria>, page: number, limit: number, sortCriteria: SortProductCriteria): Promise<{ products: IProduct[]; total: number }> {
    const skip = (page - 1) * limit;
    console.log("Filters:", filters);
    const query: FilterQuery<AdminSearchProductCriteria> = {};
    if (filters.name) query.name = { $regex: filters.name, $options: "i" };
    if (filters.available !== undefined) query.available = filters.available;
    if (filters.category) query.category = filters.category;
    if (filters.id) query.id = filters.id;
    if (filters.stripePriceId) query.stripePriceId = filters.stripePriceId;
    if (filters.stripePriceIdYearly) query.stripePriceIdYearly = filters.stripePriceIdYearly;
    if (filters.stripeProductId) query.stripeProductId = filters.stripeProductId;
    if (filters.active !== undefined) query.active = filters.active;
    
    if (sortCriteria.sortBy && sortCriteria.sortBy !== "monthlyPrice" && sortCriteria.sortBy !== "yearlyPrice") {
      const sortOrder = sortCriteria.sortOrder === "asc" ? 1 : -1;
      query.sort = { [sortCriteria.sortBy]: sortOrder };
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort(query.sort).populate("category").populate("features").skip(skip).limit(limit),
      Product.countDocuments(query)
    ]);
    return { products, total };
  }
  

  async update(id: string, userData: Partial<IProduct>): Promise<IProduct | null> {
    return await Product.findOneAndUpdate({ id }, userData, { new: true }).populate("category").populate("features");
  }

  async delete(id: string): Promise<boolean> {
    const result = await Product.deleteOne({ id });
    return result.deletedCount === 1;
  }

  async find(query: FilterQuery<IProduct>): Promise<IProduct[]> {
    return await Product.find(query).populate("category").populate("features");
  }
}
