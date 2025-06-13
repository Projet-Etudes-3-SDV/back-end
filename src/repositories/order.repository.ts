import { FilterQuery } from "mongoose";
import Order, { IOrder } from "../models/order.model";
import { SortOrderCriteria } from "../types/dtos/orderDtos";

export class OrderRepository {
  async create(orderData: Partial<IOrder>): Promise<IOrder> {
    const order = new Order(orderData);
    return await order.save();
  }

  async findById(id: string): Promise<IOrder | null> {
    return await Order.findOne({ id }).populate("user").populate("products.product").populate("products.product.category");
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

    return await Order.findOne(query).populate([
      {
        path: "user",
      },
      {
        path: "products.product",
        populate: {
          path: "category",
        },
      },
    ]);
  }

  async findAll(page: number, limit: number): Promise<{ orders: IOrder[]; total: number }> {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find().sort({ orderDate: -1 }).skip(skip).limit(limit).populate([
        {
          path: "user",
        },
        {
          path: "products.product",
          populate: {
            path: "category",
          },
        },
      ]),
      Order.countDocuments(),
    ]);
    return { orders, total };
  }

  async findManyBy(filters: Partial<IOrder>, page: number, limit: number, sortCriteria: SortOrderCriteria): Promise<{ orders: IOrder[]; total: number }> {
    const skip = (page - 1) * limit;

    const query: FilterQuery<IOrder> = {};
    if (filters.id) query.id = filters.id;
    if (filters.user) query.user = filters.user;
    if (filters.status) query.status = filters.status;
    if (filters.sessionId) query.sessionId = filters.sessionId;
    
    if (sortCriteria.sortBy) {
      const sortOrder = sortCriteria.sortOrder === "asc" ? 1 : -1;
      query.sort = { [sortCriteria.sortBy]: sortOrder };
    }

    const [orders, total] = await Promise.all([
      Order.find(query).skip(skip).limit(limit).populate([
        {
          path: "user",
        },
        {
          path: "products.product",
          populate: {
            path: "category",
          },
        },
      ]),
      Order.countDocuments(query),
    ]);
    return { orders, total };
  }

  async update(id: string, orderData: Partial<IOrder>): Promise<IOrder | null> {
    return await Order.findOneAndUpdate({ id }, orderData, { new: true }).populate([
      {
        path: "user",
      },
      {
        path: "products.product",
        populate: {
          path: "category",
        },
      },
    ]);
  }

  async delete(id: string): Promise<boolean> {
    const result = await Order.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
