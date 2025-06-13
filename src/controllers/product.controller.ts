import type { Request, Response, NextFunction } from "express";
import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../utils/AppError";
import { EncodedRequest } from "../utils/EncodedRequest";
import { ProductService } from "../services/product.service";
import { AdminProductPresenter, ProductPresenter, ProductToCreate, ProductToModifyDTO, SearchProductCriteria, SortProductCriteria } from "../types/dtos/productDtos";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

    async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
        const productData = plainToClass(ProductToCreate, req.body);
        const dtoErrors = await validate(productData);
        if (dtoErrors.length > 0) {
            const errors = dtoErrors.map(error => ({
            field: error.property,
            constraints: error.constraints ? Object.values(error.constraints) : []
            }));
            throw new AppError("Validation failed", 400, errors);
        }
        const product = await this.productService.createProduct(productData);
        const productPresenter = plainToClass(ProductPresenter, product, { excludeExtraneousValues: true });
        res.status(201).json(productPresenter);
        } catch (error) {
        next(error);
        }
    }

    async getProductAsAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
        const product = await this.productService.getProduct(req.params.id);
        const productPresenter = plainToClass(AdminProductPresenter, product, { excludeExtraneousValues: true });
        res.status(200).json(productPresenter);
        } catch (error) {
        next(error);
        }
    }

    async getProductsAsAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
        const searchCriteria = plainToClass(SearchProductCriteria, req.query);
        const sortCriteria = plainToClass(SortProductCriteria, req.query);
        const dtoErrors = await validate(searchCriteria);
        dtoErrors.push(...await validate(sortCriteria));
        if (dtoErrors.length > 0) {
            const errors = dtoErrors.map(error => ({
            field: error.property,
            constraints: error.constraints ? Object.values(error.constraints) : []
            }));
            throw new AppError("Validation failed", 400, errors);
        }
        const { products, total, pages } = await this.productService.getProducts(searchCriteria, sortCriteria);
        const productPresenters = plainToInstance(AdminProductPresenter, products, { excludeExtraneousValues: true });
        res.status(200).json({ result: productPresenters, total, pages });
        } catch (error) {
        next(error);
        }
    }

    async getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const product = await this.productService.getProduct(req.params.id);
            const productPresenter = plainToClass(ProductPresenter, product, { excludeExtraneousValues: true });
            res.status(200).json(productPresenter);
        } catch (error) {
            next(error);
        }
    }

    async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const searchCriteria = plainToClass(SearchProductCriteria, req.query);
            const sortCriteria = plainToClass(SortProductCriteria, req.query);
            const dtoErrors = await validate(searchCriteria);
            dtoErrors.push(...await validate(sortCriteria));
            if (dtoErrors.length > 0) {
                const errors = dtoErrors.map(error => ({
                    field: error.property,
                    constraints: error.constraints ? Object.values(error.constraints) : []
                }));
                throw new AppError("Validation failed", 400, errors);
            }
            const { products, total, pages } = await this.productService.getProducts(searchCriteria, sortCriteria);
            const productPresenters = plainToInstance(ProductPresenter, products, { excludeExtraneousValues: true });
            res.status(200).json({ result: productPresenters, total, pages });
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
        const productData = plainToClass(ProductToModifyDTO, req.body);
        const dtoErrors = await validate(productData);
        if (dtoErrors.length > 0) {
            const errors = dtoErrors.map(error => ({
            field: error.property,
            constraints: error.constraints ? Object.values(error.constraints) : []
            }));
            throw new AppError("Validation failed", 400, errors);
        }
        const product = await this.productService.updateProduct(req.params.id, productData);
        const productPresenter = plainToClass(ProductPresenter, product, { excludeExtraneousValues: true });
        res.status(200).json(productPresenter);
        } catch (error) {
        next(error);
        }
    }

    async deleteProduct(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
        await this.productService.deleteProduct(req.params.id);
        res.status(204).end();
        } catch (error) {
        next(error);
        }
    }
}
