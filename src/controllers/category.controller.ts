import type { Request, Response, NextFunction } from "express";
import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../utils/AppError";
import { CategoryService } from "../services/category.service";
import { CategoryPresenter, CategoryToCreate, CategoryToModify, SearchCategoryCriteria } from "../types/dtos/categoryDtos";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryData = plainToClass(CategoryToCreate, req.body);
      const dtoErrors = await validate(categoryData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const category = await this.categoryService.createCategory(categoryData);
      const categoryPresenter = plainToClass(CategoryPresenter, category, { excludeExtraneousValues: true });
      res.status(201).json(categoryPresenter);
    } catch (error) {
      next(error);
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      if (!category) {
        throw new AppError("Category not found", 404);
      }
      const categoryPresenter = plainToClass(CategoryPresenter, category, { excludeExtraneousValues: true });
      res.status(200).json(categoryPresenter);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchCriteria = plainToClass(SearchCategoryCriteria, req.query);
      const dtoErrors = await validate(searchCriteria);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const { categories, total, pages } = await this.categoryService.searchCategories(searchCriteria);
      const categoryPresenters = plainToInstance(CategoryPresenter, categories, { excludeExtraneousValues: true });
      res.status(200).json({data: categoryPresenters, total, pages});
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryData = plainToClass(CategoryToModify, req.body);
      const dtoErrors = await validate(categoryData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const category = await this.categoryService.updateCategory(req.params.id, categoryData);
      if (!category) {
        throw new AppError("Category not found", 404);
      }
      const categoryPresenter = plainToClass(CategoryPresenter, category, { excludeExtraneousValues: true });
      res.status(200).json(categoryPresenter);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.categoryService.deleteCategory(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}
