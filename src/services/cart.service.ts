import { UserRepository } from "../repositories/user.repository";
import CartItem, { ICart } from "../models/cart.model";
import { AppError } from "../utils/AppError";
import { ProductRepository } from "../repositories/product.repository";
import { CartRepository } from "../repositories/cart.repository";

export class CartService {
  private userRepository: UserRepository;
  private productRepository: ProductRepository;
  private cartRepository: CartRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.productRepository = new ProductRepository();
    this.cartRepository = new CartRepository();
  }

  async addItemToCart(userId: string, productId: string): Promise<ICart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    let cart = await this.cartRepository.findByUserId(user._id);
    if (!cart) {
      cart = await this.cartRepository.create({ owner: user._id });
      user.cart = cart._id;
    }

    const existingItem = cart.products.find((item) => item.product.id=== productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.products.push({ product: product._id, quantity: 1 });
    }

    const updatedCart = await this.cartRepository.update(cart.id, cart);

    if (!updatedCart) {
      throw new AppError("Could not update cart", 500);
    }

    const updatedUser = await this.userRepository.update(user.id, user);

    if (!updatedUser) {
      throw new AppError("Could not update user", 500);
    }

    return updatedCart;
  }

  async updateCart(userId: string, newCart: ICart): Promise<ICart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.create({ owner: user._id });
      user.cart = cart._id;
    }

    for (let i = 0; i < newCart.products.length; i++) {
      const product = await this.productRepository.findOneBy({ id: newCart.products[i].product.id });
      if (!product) {
        throw new AppError("Product not found", 404);
      }

      if (newCart.products[i].quantity <= 0) {
        throw new AppError("Quantity must be greater than 0", 400);
      }
    }

    cart.products = newCart.products;

    const updatedCart = await this.cartRepository.update(cart.id, cart);

    if (!updatedCart) {
      throw new AppError("Could not update cart", 500);
    }

    const updatedUser = await this.userRepository.update(user.id, user);

    if (!updatedUser) {
      throw new AppError("Could not update user", 500);
    }

    return updatedCart;
  }

  async deleteItemFromCart(userId: string, productId: string): Promise<ICart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new AppError("ICart not found", 404);
    }

    cart.products = cart.products.filter((cartItem) => cartItem.product.id !== productId);

    const updatedCart = await this.cartRepository.update(cart.id, cart);

    if (!updatedCart) {
      throw new AppError("Could not update cart", 500);
    }

    return updatedCart;
  }

  async resetCart(userId: string): Promise<ICart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new AppError("ICart not found", 404);
    }

    cart.products = [];

    const updatedCart = await this.cartRepository.update(cart.id, cart);

    if (!updatedCart) {
      throw new AppError("Could not update cart", 500);
    }

    return updatedCart;
  }
}