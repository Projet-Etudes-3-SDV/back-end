import { FilterQuery } from "mongoose";
import Category, { type ICategory } from "../models/category.model";
import { SearchCategoryCriteria } from "../types/dtos/categoryDtos";

export class CategoryRepository {
  async create(data: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(data);
    return await category.save();
  }

  async findById(id: string): Promise<ICategory | null> {
    return await Category.findOne({id});
  }

  async findOneBy(filters: FilterQuery<SearchCategoryCriteria>): Promise<ICategory | null> {
    const query: FilterQuery<SearchCategoryCriteria> = {};
    if (filters.name) query.name = { $regex: filters.name, $options: "i" };
    return await Category.findOne(query);
  }

  async findBy(filters: Partial<SearchCategoryCriteria>, page: number, limit: number): Promise<{ categories: ICategory[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: FilterQuery<SearchCategoryCriteria> = {};
    if (filters.name) query.name = { $regex: filters.name, $options: "i" };
    
    const [categories, total] = await Promise.all([
      Category.find(query).skip(skip).limit(limit),
      Category.countDocuments(query)
    ]);
    return { categories, total };
  }

  async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await Category.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
