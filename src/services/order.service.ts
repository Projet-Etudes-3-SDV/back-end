import { OrderRepository } from "../repositories/order.repository";
import { IOrder, OrderStatus, OrderWithPricedProducts } from "../models/order.model";
import { OrderNotFound } from "../types/errors/order.errors";
import { UserRepository } from "../repositories/user.repository";
import { SearchOrderCriteria } from "../types/filters/order.filters";
import { SortOrderCriteria } from "../types/sorts/order.sorts";
import { OrderToCreate, OrderToModify } from "../types/requests/order.requests";
import { IPriceService, StripePriceService } from "./price.service";
import Stripe from "stripe";
import { ProductPricedFactory } from "./product.service";
import type { IProduct } from "../models/product.model";



export class OrderService {
  private orderRepository: OrderRepository;
  private userRepository: UserRepository;
  private priceService: IPriceService;
  private stripe: Stripe;
  constructor() {
    this.orderRepository = new OrderRepository();
    this.userRepository = new UserRepository();
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-02-24.acacia',
    });
    this.priceService = new StripePriceService(this.stripe);
  }

  async createOrder(orderData: OrderToCreate): Promise<IOrder> {
    return await this.orderRepository.create(orderData);
  }

  async getOrder(id: string): Promise<IOrder> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new OrderNotFound();
    }

    order.products.map(async (product, index) => {
      order.products[index].product = await ProductPricedFactory.createWithPrices(product.product, this.priceService);
    });
    return order;
  }

  async getOrders(searchCriteria: SearchOrderCriteria, page: number, limit: number, sortCriteria: SortOrderCriteria): Promise<{ orders: IOrder[]; total: number }> {
    if (searchCriteria.user) {
      const user = await this.userRepository.findOneBy({ id: searchCriteria.user });
      searchCriteria.user = user?._id
    }

    return await this.orderRepository.findManyBy(searchCriteria, page, limit, sortCriteria);
  }

  async getOrdersByUser(userId: string, page: number, limit: number, sortCriteria: SortOrderCriteria): Promise<{ orders: IOrder[]; total: number }> {
    return await this.orderRepository.findManyBy({ user: userId }, page, limit, sortCriteria);
  }

  async updateOrder(id: string, orderData: OrderToModify): Promise<IOrder> {
    const order = await this.orderRepository.update(id, orderData);
    if (!order) {
      throw new OrderNotFound();
    }
    return order;
  }

  async deleteOrder(id: string): Promise<void> {
    const success = await this.orderRepository.delete(id);
    if (!success) {
      throw new OrderNotFound();
    }
  }

  async updateOrderStatusBySessionId(sessionId: string, status: OrderStatus): Promise<IOrder | null> {
    const order = await this.orderRepository.findOneBy({ sessionId });
    if (!order) {
      throw new OrderNotFound();
    }
    order.status = status;
    return await this.orderRepository.update(order.id, order);
  }
}

export class OrderPricedFactory {
  static async createWithPricedProducts(
    order: IOrder,
    priceService: IPriceService
  ): Promise<OrderWithPricedProducts> {
    const productsWithPrices = await Promise.all(
      order.products.map(async ({ product, plan }) => {
        const productDoc = await (await import("mongoose")).default.model("Product").findById(product).lean();
        const productPriced = await ProductPricedFactory.createWithPrices(productDoc as IProduct, priceService);
        return { product: productPriced, plan };
      })
    );
    return new OrderWithPricedProducts(order, productsWithPrices);
  }
}
