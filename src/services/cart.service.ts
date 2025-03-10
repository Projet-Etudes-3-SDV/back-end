import { UserRepository } from "../repositories/user.repository";
import type { IUser } from "../models/user.model";
import { AppError } from "../utils/AppError";
import { UserToCreate, UserToModify, SearchUserCriteria } from "../types/dtos/userDtos";
import { ProductRepository } from "../repositories/product.repository";

export class CartService {
  private userRepository: UserRepository;
  private productRepository: ProductRepository;
  constructor() {
    this.userRepository = new UserRepository();
    this.productRepository = new ProductRepository();
  }

  async addItemToCart(userId: string, productId: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({id: userId});
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const product = await this.productRepository.findOneBy({id: productId});
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    user.cart.push(product._id);

    const updatedUser = await this.userRepository.update(userId, { cart: user.cart })

    if (!updatedUser) {
      throw new AppError("Could not update user", 500);
    }

    return updatedUser;
  }

  async deleteItemFromCart(userId: string, productId: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({id: userId});
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const product = await this.productRepository.findOneBy({id: productId});
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    const updatedCart = user.cart.filter((cartItem) => cartItem.id !== productId);

    const updatedUser = await this.userRepository.update(userId, { cart: updatedCart })

    if (!updatedUser || updatedUser === null) {
      throw new AppError("Could not update user", 500);
    }

    return updatedUser;
  }

  async resetCart(userId: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({id: userId});
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const updatedUser = await this.userRepository.update(userId, { cart: [] })

    if (!updatedUser) {
      throw new AppError("Could not update user", 500);
    }

    return updatedUser;
  }
}