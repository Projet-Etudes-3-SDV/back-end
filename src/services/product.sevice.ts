import type { IProduct } from "../models/product.model";
import { AppError } from "../utils/AppError";
import { ProductToCreate, ProductToModify, SearchProductCriteria } from "../types/dtos/productDtos";
import { ProductRepository } from "../repositories/product.repository";

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(productData: ProductToCreate): Promise<IProduct> {
    const existingProduct = await this.productRepository.findOneBy({ name: productData.name });
    if (existingProduct) {
      throw new AppError("Product already exists", 400);
    }
    return await this.productRepository.create(productData);
  }

    async getProduct(id: string): Promise<IProduct> {
      const product = await this.productRepository.findById(id);
      if (!product) {
            throw new AppError("Product not found", 404);
        }
      return product;
    }

    async getProducts(searchCriteria: SearchProductCriteria): Promise<{ products: IProduct[]; total: number; pages: number }> {
      const { page = 1, limit = 10, ...filters } = searchCriteria;
      const { products, total } = await this.productRepository.findBy(filters, page, limit);
      const pages = Math.ceil(total / limit);
      return { products, total, pages };
    }

		async updateProduct(id: string, productData: ProductToModify): Promise<IProduct> {
			const product = await this.productRepository.findById(id);
			if (!product) {
				throw new AppError("Product not found", 404);
			}
			const updatedProduct = await this.productRepository.update(id, productData);
			if (!updatedProduct) {
				throw new AppError("Product not found", 404);
			}
			return updatedProduct;
		}

		async deleteProduct(id: string): Promise<void> {
			const product = await this.productRepository.findById(id);

			if (!product) {
				throw new AppError("Product not found", 404);
			}
			const result = await this.productRepository.delete(id);
			if (!result) {
				throw new AppError("Failed to delete product", 500);
			}
		}

}