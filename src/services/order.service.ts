import { OrderRepository } from "../repositories/order.repository";
import { IOrder, OrderStatus } from "../models/order.model";
import { OrderNotFound } from "../types/errors/order.errors";
import { OrderToCreate, OrderToModify } from "../types/dtos/orderDtos";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async createOrder(orderData: OrderToCreate): Promise<IOrder> {
    return await this.orderRepository.create(orderData);
  }

  async getOrder(id: string): Promise<IOrder> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new OrderNotFound();
    }
    return order;
  }

  async getOrders(page: number, limit: number): Promise<{ orders: IOrder[]; total: number }> {
    return await this.orderRepository.findAll(page, limit);
  }

  async getOrdersByUser(userId: string, page: number, limit: number): Promise<{ orders: IOrder[]; total: number }> {
    return await this.orderRepository.findManyBy({ user: userId }, page, limit);
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
