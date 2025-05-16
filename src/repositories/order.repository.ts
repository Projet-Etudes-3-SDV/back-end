import { FilterQuery } from "mongoose";
import Order, { IOrder } from "../models/order.model";

export class OrderRepository {
  async create(orderData: Partial<IOrder>): Promise<IOrder> {
    const order = new Order(orderData);
    return await order.save();
  }

  async findById(id: string): Promise<IOrder | null> {
    return await Order.findOne({ id }).populate("user").populate("products.product");
  }

  async findOneBy(filters: Partial<IOrder>): Promise<IOrder | null> {
    const query: FilterQuery<IOrder> = {};

    if (filters) {
      if (filters.id) query.id = filters.id;
      if (filters.user) query.user = filters.user;
      if (filters.status) query.status = filters.status;
      if (filters.sessionId) query.sessionId = filters.sessionId;
    } else {
      return null;
    }

    return await Order.findOne(query).populate("user").populate("products.product");
  }

  async findAll(page: number, limit: number): Promise<{ orders: IOrder[]; total: number }> {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find().skip(skip).limit(limit).populate("user").populate("products.product"),
      Order.countDocuments(),
    ]);
    return { orders, total };
  }

  async update(id: string, orderData: Partial<IOrder>): Promise<IOrder | null> {
    return await Order.findOneAndUpdate({ id }, orderData, { new: true }).populate("user").populate("products.product");
  }

  async delete(id: string): Promise<boolean> {
    const result = await Order.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
