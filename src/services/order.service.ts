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
import { ProductPriced } from "../types/pojos/product-priced.pojo";
import { SubscriptionPlan } from "../models/subscription.model";

export class OrderPricedFactory {
  static create(order: IOrder, products: { product: ProductPriced; plan: SubscriptionPlan }[]): OrderWithPricedProducts {
    return new OrderWithPricedProducts(order, products);
  }
}

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
    const existingOrder = await this.orderRepository.findOneBy({ sessionId: orderData.sessionId });
    if (existingOrder) {
      return existingOrder;
    }
    return await this.orderRepository.create(orderData);
  }

  async getOrder(id: string, userId: string): Promise<OrderWithPricedProducts> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new OrderNotFound();
    }

    if (order.user.id !== userId) {
      throw new OrderNotFound();
    }

    const products = await this.getProductsForOrder(order);
    return OrderPricedFactory.create(order, products);
  }


  async getOrderBySession(id: string, userId: string): Promise<OrderWithPricedProducts> {
    const order = await this.orderRepository.findOneBy({ sessionId: id });
    if (!order) {
      throw new OrderNotFound();
    }

    if (order.user.id !== userId) {
      throw new OrderNotFound();
    }

    const products = await this.getProductsForOrder(order);
    return OrderPricedFactory.create(order, products);
  }

  async getOrders(searchCriteria: SearchOrderCriteria, page: number, limit: number, sortCriteria: SortOrderCriteria): Promise<{ orders: OrderWithPricedProducts[]; total: number }> {
    if (searchCriteria.user) {
      const user = await this.userRepository.findOneBy({ id: searchCriteria.user });
      searchCriteria.user = user?._id
    }

    const { orders, total } = await this.orderRepository.findManyBy(searchCriteria, page, limit, sortCriteria);

    const pricedOrders = await Promise.all(
      orders.map(async (order) => {
        const products = await this.getProductsForOrder(order);
        return OrderPricedFactory.create(order, products);
      })
    );
    return { orders: pricedOrders, total };
  }

  async getOrdersByUser(userId: string, page: number, limit: number, sortCriteria: SortOrderCriteria): Promise<{ orders: OrderWithPricedProducts[]; total: number }> {
    const { orders, total } = await this.orderRepository.findManyBy({ user: userId }, page, limit, sortCriteria);

    const pricedOrders = await Promise.all(
      orders.map(async (order) => {
        const products = await this.getProductsForOrder(order);
        return OrderPricedFactory.create(order, products);
      })
    );
    return { orders: pricedOrders, total };
  }

  async updateOrder(id: string, orderData: OrderToModify): Promise<OrderWithPricedProducts> {
    const order = await this.orderRepository.update(id, orderData);
    if (!order) {
      throw new OrderNotFound();
    }
    const products = await this.getProductsForOrder(order);
    return OrderPricedFactory.create(order, products);
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

  async getProductsForOrder(order: IOrder): Promise<{ product: ProductPriced; plan: SubscriptionPlan }[]> {
    return Promise.all(
      order.products.map(async (product) => ({
        product: await ProductPricedFactory.createWithPrices(product.product, this.priceService),
        plan: product.plan
      }))
    );
  }
}