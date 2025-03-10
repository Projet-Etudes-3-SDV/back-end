import Category from "../models/category.model";
import { ICategory } from "../models/category.model";
import { CategoryToCreate, CategoryToModify, SearchCategoryCriteria } from "../types/dtos/categoryDtos";

class CategoryService {
  async createCategory(data: CategoryToCreate): Promise<ICategory> {
    const category = new Category(data);
    return await category.save();
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    return await Category.findById(id).exec();
  }

  async updateCategory(id: string, data: CategoryToModify): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteCategory(id: string): Promise<ICategory | null> {
    return await Category.findByIdAndDelete(id).exec();
  }

  async searchCategories(criteria: SearchCategoryCriteria): Promise<ICategory[]> {
    const query: any = {};
    if (criteria.name) {
      query.name = { $regex: criteria.name, $options: "i" };
    }
    return await Category.find(query)
      .skip((criteria.page - 1) * criteria.limit)
      .limit(criteria.limit)
      .exec();
  }
}

export default new CategoryService();
