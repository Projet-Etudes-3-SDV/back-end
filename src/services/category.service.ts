import type { ICategory } from "../models/category.model";
import { CategoryAlreadyExists, CategoryNotFound, CategoryUpdateFailed, CategoryDeleteFailed } from "../types/errors/category.errors";
import { CategoryRepository } from "../repositories/category.repository";
import { CategoryToCreate, CategoryToModify } from "../types/requests/category.requests";
import { SearchCategoryCriteria } from "../types/filters/category.filters";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(data: CategoryToCreate): Promise<ICategory> {
    const existingCategory = await this.categoryRepository.findOneBy({ name: data.name });
    if (existingCategory) {
      throw new CategoryAlreadyExists();
    }

    return await this.categoryRepository.create(data);
  }

  async getCategoryById(id: string): Promise<ICategory> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new CategoryNotFound();
    }
    return category;
  }

  async updateCategory(id: string, data: CategoryToModify): Promise<ICategory> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new CategoryNotFound();
    }

    const updatedCategory = await this.categoryRepository.update(category._id, data);
    if (!updatedCategory) {
      throw new CategoryUpdateFailed();
    }
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new CategoryNotFound();
    }
    const result = await this.categoryRepository.delete(id);
    if (!result) {
      throw new CategoryDeleteFailed();
    }
  }

  async searchCategories(criteria: SearchCategoryCriteria): Promise<{ categories: ICategory[]; total: number; pages: number }> {
    const { page = 1, limit = 10, ...filters } = criteria;
    const { categories, total } = await this.categoryRepository.findBy(filters, page, limit);
    const pages = Math.ceil(total / limit);
    return { categories, total, pages };
  }
}
