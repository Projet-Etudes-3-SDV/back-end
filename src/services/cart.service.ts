import { UserRepository } from "../repositories/user.repository";
import { ICart } from "../models/cart.model";
import { ProductRepository } from "../repositories/product.repository";
import { CartRepository } from "../repositories/cart.repository";
import { SubscriptionPlan } from "../models/subscription.model";
import { SubscriptionService } from "./subscription.service";
import {
  CartProductNotFound,
  CartInvalidPlan,
  CartItemExists,
  CartDifferentPlans,
  CartAlreadySubscribed,
  CartUpdateFailed,
  CartNotFound
} from "../types/errors/cart.errors";
import { UserNotFound } from "../types/errors/user.errors";
import { ProductService } from "./product.service";
import { ProductPriced } from "../types/dtos/productDtos";
import { CartWithPricedProducts } from "../types/dtos/cartDtos";

export class CartService {
  private userRepository: UserRepository;
  private productRepository: ProductRepository;
  private productService: ProductService;
  private cartRepository: CartRepository;
  private subscriptionService: SubscriptionService;

  constructor() {
    this.userRepository = new UserRepository();
    this.productRepository = new ProductRepository();
    this.cartRepository = new CartRepository();
    this.subscriptionService = new SubscriptionService();
    this.productService = new ProductService();
  }

  async addItemToCart(userId: string, productId: string, plan: string): Promise<CartWithPricedProducts> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UserNotFound();
    }
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new CartProductNotFound();
    }

    if (plan !== SubscriptionPlan.MONTHLY && plan !== SubscriptionPlan.YEARLY && plan !== SubscriptionPlan.FREE_TRIAL) {
      throw new CartInvalidPlan();
    }

    let cart = await this.cartRepository.findByUserId(user._id);
    if (!cart) {
      cart = await this.cartRepository.create({ owner: user._id });
      user.cart = cart._id;
    }
    
    const existingItem = cart.products.find((item) => item.product.id === productId);
    if (existingItem) {
      throw new CartItemExists();
    } else {
      cart.products.push({ product: product._id, quantity: 1, plan: plan });
    }

    if (cart.products.find((product) => product.plan !== plan)) {
      throw new CartDifferentPlans();
    }

    if (user.stripeCustomerId) {
      const existingSubscription = await this.subscriptionService.getUserSubscription(user.stripeCustomerId);
      existingSubscription.map((sub => {
        if (sub.productId === product.stripeProductId && sub.status === "active") {
          throw new CartAlreadySubscribed();
        }}));
    }

    const updatedCart = await this.cartRepository.update(cart.id, cart);

    if (!updatedCart) {
      throw new CartUpdateFailed();
    }

    const updatedUser = await this.userRepository.update(user.id, user);

    if (!updatedUser) {
      throw new CartUpdateFailed();
    }

    const productPrices = await this.getCartPrices(updatedCart)

    const cartWithPrices = new CartWithPricedProducts(updatedCart, productPrices);

    return cartWithPrices;
  }

  async updateCart(userId: string, newCart: ICart): Promise<CartWithPricedProducts> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UserNotFound();
    }

    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.create({ owner: user._id });
      user.cart = cart._id;
    }

    for (let i = 0; i < newCart.products.length; i++) {
      const product = await this.productRepository.findOneBy({ id: newCart.products[i].product.id });
      if (!product) {
        throw new CartProductNotFound();
      }

      if (newCart.products[i].quantity <= 0) {
        throw new CartInvalidPlan(); // Or create a CartInvalidQuantity error if needed
      }
    }

    cart.products = newCart.products;

    const updatedCart = await this.cartRepository.update(cart.id, cart);

    if (!updatedCart) {
      throw new CartUpdateFailed();
    }

    const updatedUser = await this.userRepository.update(user.id, user);

    if (!updatedUser) {
      throw new CartUpdateFailed();
    }

    const productPrices = await this.getCartPrices(updatedCart)

    const cartWithPrices = new CartWithPricedProducts(updatedCart, productPrices);

    return cartWithPrices;
  }

  async deleteItemFromCart(userId: string, productId: string): Promise<CartWithPricedProducts> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UserNotFound();
    }

    const cart = await this.cartRepository.findByUserId(user._id);
    if (!cart) {
      throw new CartNotFound();
    }

    cart.products = cart.products.filter((cartItem) => cartItem.product.id !== productId);

    const updatedCart = await this.cartRepository.update(cart.id, cart);

    if (!updatedCart) {
      throw new CartUpdateFailed();
    }

    const productPrices = await this.getCartPrices(updatedCart)

    const cartWithPrices = new CartWithPricedProducts(updatedCart, productPrices);

    return cartWithPrices;
  }

  async resetCart(userId: string): Promise<ICart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UserNotFound();
    }

    const cart = await this.cartRepository.findByUserId(user._id);
    if (!cart) {
      throw new CartNotFound();
    }

    cart.products = [];

    const updatedCart = await this.cartRepository.update(cart.id, cart);

    if (!updatedCart) {
      throw new CartUpdateFailed();
    }

    return updatedCart;
  }

  async getCart(userId: string): Promise<CartWithPricedProducts> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UserNotFound();
    }

    const cart = await this.cartRepository.findByUserId(user._id);
    if (!cart) {
      throw new CartNotFound();
    }

    const productPrices = await this.getCartPrices(cart)

    const cartWithPrices = new CartWithPricedProducts(cart, productPrices);

    return cartWithPrices;
  }

  async getCartPrices(cart: ICart): Promise<ProductPriced[]> {
    const productsWithPrices: ProductPriced[] = [];

    for (const item of cart.products) {
      const productPriced = await this.productService.getProduct(item.product.id);
      if (!productPriced) {
        throw new CartProductNotFound();
      }
      productsWithPrices.push(productPriced as ProductPriced);
    }

    return productsWithPrices
  }

  async validateCart(userId: string): Promise<ICart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UserNotFound();
    }

    const cart = await this.cartRepository.findByUserId(user._id);
    if (!cart) {
      throw new CartNotFound();
    }

    // Clear the cart after validation
    cart.products = [];

    const updatedCart = await this.cartRepository.update(cart.id, cart);
    if (!updatedCart) {
      throw new CartUpdateFailed();
    }

    return updatedCart;
  }
}