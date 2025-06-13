import { FilterQuery } from "mongoose";
import User, { type IUser } from "../models/user.model";
import { AdminSearchUserCriteria, SearchUserCriteria } from "../types/filters/user.filters";
import { UserToCreate } from "../types/requests/user.requests";
import { SortUserCriteria } from "../types/sorts/user.sorts";

export class UserRepository {
  async create(userData: UserToCreate): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findOne({ id }).populate([{
      path: 'cart',
      populate: [{
        path: 'products.product',
        populate: { path: 'category' }
      },
      {
        path: 'owner',
      }],
    }]);
  }

  async findOneBy(filters: FilterQuery<AdminSearchUserCriteria>): Promise<IUser | null> {
    const query: FilterQuery<AdminSearchUserCriteria> = {};
    if (filters) {
      if (filters.lastName) query.lastName = { $regex: filters.lastName, $options: "i" };
      if (filters.firstName) query.firstName = { $regex: filters.firstName, $options: "i" };
      if (filters.email) query.email = filters.email;
      if (filters.phone) query.phone = filters.phone;
      if (filters.role) query.role = filters.role;
      if (filters.id) query.id = filters.id;
      if (filters.authToken) query.authToken = filters.authToken;
      if (filters.isValidated) query.isValidated = filters.isValidated;
      if (filters.resetPasswordToken) query.resetPasswordToken = filters.resetPasswordToken;
      if (filters.paymentSessionId) query.paymentSessionId = filters.paymentSessionId;
      if (filters.stripeCustomerId) query.stripeCustomerId = filters.stripeCustomerId;
      if (filters.authCode) query.authCode = filters.authCode;
      if (filters.authCodeExpires) query.authCodeExpires = { $gte: new Date() };
      if (filters.id) query.id = filters.id;
      
    } else {
      return null;
    }
    
    return await User.findOne(query).populate([{
      path: 'cart',
      populate: [{
        path: 'products.product',
        populate: { path: 'category' }
      },
      {
        path: 'owner',
      }],
    }]);
  }

  async findAll(page: number, limit: number): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).populate([{
      path: 'cart',
      populate: [{
        path: 'products.product',
        populate: { path: 'category' }
      },
      {
        path: 'owner',
      }],
    }]),
      User.countDocuments()
    ]);
    return { users, total };
  }

  async findBy(filters: Partial<SearchUserCriteria>, page: number, limit: number, sortCriteria: SortUserCriteria): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit;

    const query: FilterQuery<SearchUserCriteria> = {};
    if (filters.lastName) query.lastName = { $regex: filters.lastName, $options: "i" };
    if (filters.firstName) query.firstName = { $regex: filters.firstName, $options: "i" };
    if (filters.email) query.email = filters.email;
    if (filters.id) query.id = filters.id;
    if (filters.authToken) query.authToken = filters.authToken;
    if (filters.resetPasswordToken) query.resetPasswordToken = filters.resetPasswordToken;

    if (sortCriteria.sortBy) {
      const sortOrder = sortCriteria.sortOrder === "asc" ? 1 : -1;
      query.sort = { [sortCriteria.sortBy]: sortOrder };
    }

    const [users, total] = await Promise.all([
      User.find(query).sort(query.sort).skip(skip).limit(limit).populate([{
      path: 'cart',
      populate: [{
        path: 'products.product',
        populate: { path: 'category' }
      },
      {
        path: 'owner',
      }],
    }]),
      User.countDocuments(query)
    ]);
    return { users, total };
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return await User.findOneAndUpdate({ id }, userData, { new: true }).populate([{
      path: 'cart',
      populate: [{
        path: 'products.product',
        populate: { path: 'category' }
      },
      {
        path: 'owner',
      }],
    }]);
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
