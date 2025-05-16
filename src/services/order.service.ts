import { OrderRepository } from "../repositories/order.repository";
import { IOrder, OrderStatus } from "../models/order.model";
import { AppError } from "../utils/AppError";
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
      throw new AppError("Order not found", 404, [], "ORDER_NOT_FOUND");
    }
    return order;
  }

  async getOrders(page: number, limit: number): Promise<{ orders: IOrder[]; total: number }> {
    return await this.orderRepository.findAll(page, limit);
  }

  async updateOrder(id: string, orderData: OrderToModify): Promise<IOrder> {
    const order = await this.orderRepository.update(id, orderData);
    if (!order) {
      throw new AppError("Order not found", 404, [], "ORDER_NOT_FOUND");
    }
    return order;
  }

  async deleteOrder(id: string): Promise<void> {
    const success = await this.orderRepository.delete(id);
    if (!success) {
      throw new AppError("Order not found", 404, [], "ORDER_NOT_FOUND");
    }
  }

  async updateOrderStatusBySessionId(sessionId: string, status: OrderStatus): Promise<IOrder | null> {
    const order = await this.orderRepository.findOneBy({ sessionId });
    if (!order) {
      throw new AppError("Order not found", 404, [], "ORDER_NOT_FOUND");
    }
    order.status = status;
    return await this.orderRepository.update(order.id, order);
  }
}
