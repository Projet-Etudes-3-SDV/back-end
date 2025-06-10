import type { IProduct } from "../models/product.model";
import { ProductAlreadyExists, ProductNotFound, ProductNegativePrice, ProductNegativeStock, ProductCategoryNotFound, ProductUpdateFailed, ProductDeleteFailed } from "../types/errors/product.errors";
import { ProductToCreate, ProductToModify, SearchProductCriteria } from "../types/dtos/productDtos";
import { ProductRepository } from "../repositories/product.repository";
import { CategoryRepository } from "../repositories/category.repository";

export class ProductService {
  private productRepository: ProductRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async createProduct(productData: ProductToCreate): Promise<IProduct> {
    const existingProduct = await this.productRepository.findOneBy({ name: productData.name });
    if (existingProduct) {
      throw new ProductAlreadyExists();
    }

    if (productData.monthlyPrice < 0) {
      throw new ProductNegativePrice();
    }

    if (productData.yearlyPrice < 0) {
      throw new ProductNegativeStock();
    }

    const category = await this.categoryRepository.findOneBy({ id: productData.category });

    if (!category) {
      throw new ProductCategoryNotFound();
    }

    productData.category = category._id;

    return await this.productRepository.create(productData);
  }

  async getProduct(id: string): Promise<IProduct> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new ProductNotFound();
    }
    return product;
  }

  async getProducts(searchCriteria: SearchProductCriteria): Promise<{ products: IProduct[]; total: number; pages: number }> {
    const { page = 1, limit = 10, ...filters } = searchCriteria;
    if (filters.category) {
      const category = await this.categoryRepository.findOneBy({ id: filters.category });
      if (!category) {
        throw new ProductCategoryNotFound();
      }
      filters.category = category._id;
    }
    const { products, total } = await this.productRepository.findBy(filters, page, limit);
    const pages = Math.ceil(total / limit);
    return { products, total, pages };
  }

  async updateProduct(id: string, productData: ProductToModify): Promise<IProduct> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFound();
    }
    const updatedProduct = await this.productRepository.update(id, productData);
    if (!updatedProduct) {
      throw new ProductUpdateFailed();
    }
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFound();
    }
    const result = await this.productRepository.delete(id);
    if (!result) {
      throw new ProductDeleteFailed();
    }
  }

}