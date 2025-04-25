import { UserRepository } from "../repositories/user.repository";
import { CartStatus, ICart } from "../models/cart.model";
import { AppError } from "../utils/AppError";
import { ProductRepository } from "../repositories/product.repository";
import { CartRepository } from "../repositories/cart.repository";
import { SubscriptionPlan } from "../models/subscription.model";
import { SubscriptionService } from "./subscription.service";

export class CartService {
  private userRepository: UserRepository;
  private productRepository: ProductRepository;
  private cartRepository: CartRepository;
  private subscriptionService: SubscriptionService;

  constructor() {
    this.userRepository = new UserRepository();
    this.productRepository = new ProductRepository();
    this.cartRepository = new CartRepository();
    this.subscriptionService = new SubscriptionService();
  }

  async addItemToCart(userId: string, productId: string, plan: string): Promise<ICart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (plan !== SubscriptionPlan.MONTHLY && plan !== SubscriptionPlan.YEARLY && plan !== SubscriptionPlan.FREE_TRIAL) {
      throw new AppError("Invalid plan", 400);
    }

    let cart = await this.cartRepository.findByUserId(user._id);
    if (!cart) {
      cart = await this.cartRepository.create({ owner: user._id });
      user.cart = cart._id;
    }

    if (cart.status !== CartStatus.READY) {
      throw new AppError("You cannot add items while paying", 400, [], "CART_BUSY");
    }
    
    const existingItem = cart.products.find((item) => item.product.id === productId);
    if (existingItem) {
      // existingItem.quantity++;
      throw new AppError("User already has this item in his cart", 400, [], "CART_ITEM_EXISTS");
    } else {
      cart.products.push({ product: product._id, quantity: 1, plan: plan });
    }

    const existingSubscription = user.subscriptions.find((sub) => sub.product.id === productId && sub.status === "active");
    if (existingSubscription) {
      throw new AppError("User is already subscribed to this product", 400, [], "ALREADY_SUBSCRIBED");
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

    if (cart.status !== CartStatus.READY) {
      throw new AppError("You cannot update the cart while paying", 400, [], "CART_BUSY");
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

  async updateCartStatus(userId: string, status: CartStatus): Promise<ICart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    
    const cart = await this.cartRepository.findByUserId(user._id);
    if (!cart) {
      throw new AppError("Cart not found", 404);
    }
    cart.status = status;
    const updatedCart = await this.cartRepository.update(cart.id, cart);

    if (!updatedCart) {
      throw new AppError("Could not update cart", 500);
    }

    return updatedCart;
  }

  async deleteItemFromCart(userId: string, productId: string): Promise<ICart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const cart = await this.cartRepository.findByUserId(user._id);
    if (!cart) {
      throw new AppError("ICart not found", 404);
    }

    if (cart.status !== CartStatus.READY) {
      throw new AppError("You cannot delete items from the cart while paying", 400, [], "CART_BUSY");
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

    const cart = await this.cartRepository.findByUserId(user._id);
    if (!cart) {
      throw new AppError("ICart not found", 404);
    }

    if (cart.status !== CartStatus.READY) {
      throw new AppError("You cannot delete items from the cart while paying", 400, [], "CART_BUSY");
    }

    cart.products = [];

    const updatedCart = await this.cartRepository.update(cart.id, cart);

    if (!updatedCart) {
      throw new AppError("Could not update cart", 500);
    }

    return updatedCart;
  }

  async getCart(userId: string): Promise<ICart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const cart = await this.cartRepository.findByUserId(user._id);
    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    return cart;
  }

  async validateCart(userId: string): Promise<ICart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const cart = await this.cartRepository.findByUserId(user._id);
    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    // Logic to subscribe user to products in the cart
    for (const item of cart.products) {
      const product = await this.productRepository.findById(item.product.id)
      if (!product) {
        throw new AppError("Product not found", 404);
      }

      await this.subscriptionService.addSubscription({ user: user.id, product: product.id, plan: item.plan });
    }

    // Clear the cart after validation
    cart.products = [];
    const updatedCart = await this.cartRepository.update(cart.id, cart);

    if (!updatedCart) {
      throw new AppError("Could not update cart", 500);
    }

    return updatedCart;
  }
}