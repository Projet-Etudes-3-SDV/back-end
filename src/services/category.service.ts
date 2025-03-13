import type { ICategory } from "../models/category.model";
import { AppError } from "../utils/AppError";
import { CategoryToCreate, CategoryToModify, SearchCategoryCriteria } from "../types/dtos/categoryDtos";
import { CategoryRepository } from "../repositories/category.repository";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(data: CategoryToCreate): Promise<ICategory> {
    const existingCategory = await this.categoryRepository.findOneBy({ name: data.name });
    if (existingCategory) {
      throw new AppError("Category already exists", 400);
    }

    return await this.categoryRepository.create(data);
  }

  async getCategoryById(id: string): Promise<ICategory> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    return category;
  }

  async updateCategory(id: string, data: CategoryToModify): Promise<ICategory> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    console.log(category.id);

    const updatedCategory = await this.categoryRepository.update(category._id, data);
    if (!updatedCategory) {
      throw new AppError("Failed to update category", 500);
    }
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    const result = await this.categoryRepository.delete(id);
    if (!result) {
      throw new AppError("Failed to delete category", 500);
    }
  }

  async searchCategories(criteria: SearchCategoryCriteria): Promise<{ categories: ICategory[]; total: number; pages: number }> {
    const { page = 1, limit = 10, ...filters } = criteria;
    const { categories, total } = await this.categoryRepository.findBy(filters, page, limit);
    const pages = Math.ceil(total / limit);
    return { categories, total, pages };
  }
}
