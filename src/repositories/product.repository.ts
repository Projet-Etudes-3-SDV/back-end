import { FilterQuery } from "mongoose";
import Product, { type IProduct } from "../models/product.model";
import { ProductToCreate, SearchProductCriteria } from "../types/dtos/productDtos";

export class ProductRepository {
  async create(userData: ProductToCreate): Promise<IProduct> {
    const product = new Product(userData);
    return await product.save();
  }

  async findById(id: string): Promise<IProduct | null> {
    return await Product.findOne({ id }).populate("category");
  }

  async findOneBy(filters: FilterQuery<SearchProductCriteria>): Promise<IProduct | null> {
    const query: FilterQuery<SearchProductCriteria> = {};
    if (filters.name) query.name = { $regex: filters.name, $options: "i" };
    if (filters.available) query.available = filters.available;
    if (filters.monthlyPrice) query.monthlyPrice = filters.monthlyPrice;
    if (filters.yearlyPrice) query.yearlyPrice = filters.yearlyPrice;
    if (filters.categoryId) query.categoryId = filters.categoryId;

    return await Product.findOne(query).populate("category");
  }

  async findAll(page: number, limit: number): Promise<{ products: IProduct[]; total: number }> {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find().populate("category").skip(skip).limit(limit),
      Product.countDocuments()
    ]);
    return { products, total };
  }

  async findBy(filters: Partial<SearchProductCriteria>, page: number, limit: number): Promise<{ products: IProduct[]; total: number }> {
    const skip = (page - 1) * limit;

    const query: FilterQuery<SearchProductCriteria> = {};
    if (filters.name) query.name = { $regex: filters.name, $options: "i" };
    if (filters.available) query.available = filters.available;
    if (filters.monthlyPrice) query.monthlyPrice = filters.monthlyPrice;
    if (filters.yearlyPrice) query.yearlyPrice = filters.yearlyPrice;
    if (filters.category) query.category = filters.category;

    const [products, total] = await Promise.all([
      Product.find(query).populate("category").skip(skip).limit(limit),
      Product.countDocuments(query)
    ]);
    return { products, total };
  }

  async update(id: string, userData: Partial<IProduct>): Promise<IProduct | null> {
    return await Product.findOneAndUpdate({ id }, userData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Product.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
