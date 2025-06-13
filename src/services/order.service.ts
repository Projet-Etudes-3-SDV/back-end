import { OrderRepository } from "../repositories/order.repository";
import { IOrder, OrderStatus } from "../models/order.model";
import { OrderNotFound } from "../types/errors/order.errors";
import { OrderToCreate, OrderToModify, SearchOrderCriteria, SortOrderCriteria } from "../types/dtos/orderDtos";
import { UserRepository } from "../repositories/user.repository";

export class OrderService {
  private orderRepository: OrderRepository;
  private userRepository: UserRepository;
  constructor() {
    this.orderRepository = new OrderRepository();
    this.userRepository = new UserRepository();
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
