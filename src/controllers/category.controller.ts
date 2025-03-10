import type { Request, Response, NextFunction } from "express";
import CategoryService from "../services/categoryService";
import { plainToClass, plainToInstance } from "class-transformer";
import { CategoryPresenter, CategoryToCreate, CategoryToModify, SearchCategoryCriteria } from "../types/dtos/categoryDtos";
import { validate } from "class-validator";
import { AppError } from "../utils/AppError";

export class CategoryController {
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
      const category = await CategoryService.createCategory(categoryData);
      const categoryPresenter = plainToClass(CategoryPresenter, category, { excludeExtraneousValues: true });
      res.status(201).json(categoryPresenter);
    } catch (error) {
      next(error);
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
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
      const categories = await CategoryService.searchCategories(searchCriteria);
      const categoryPresenters = plainToInstance(CategoryPresenter, categories, { excludeExtraneousValues: true });
      res.status(200).json(categoryPresenters);
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
      const category = await CategoryService.updateCategory(req.params.id, categoryData);
      const categoryPresenter = plainToClass(CategoryPresenter, category, { excludeExtraneousValues: true });
      res.status(200).json(categoryPresenter);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await CategoryService.deleteCategory(req.params.id);
      res.status(200).json({ message: "Category deleted" });
    } catch (error) {
      next(error);
    }
  }
}
