import { FilterQuery } from "mongoose";
import User, { type IUser } from "../models/user.model";
import { UserToCreate, SearchUserCriteria } from "../types/dtos/userDtos";

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
    }, {
      path: 'subscriptions',
      populate: {
        path: 'product',
        populate: { path: 'category' }
      }
    }, {
      path: 'addresses'
    }]);
  }

  async findOneBy(filters: FilterQuery<SearchUserCriteria>): Promise<IUser | null> {
    const query: FilterQuery<SearchUserCriteria> = {};
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
    }, {
      path: 'subscriptions',
      populate: {
        path: 'product',
        populate: { path: 'category' }
      }
    }, {
      path: 'addresses'
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
    }, {
      path: 'subscriptions',
      populate: {
        path: 'product',
        populate: { path: 'category' }
      }
    }, {
      path: 'addresses',
    }]),
      User.countDocuments()
    ]);
    return { users, total };
  }

  async findBy(filters: Partial<SearchUserCriteria>, page: number, limit: number): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit;

    const query: FilterQuery<SearchUserCriteria> = {};
    if (filters.lastName) query.lastName = { $regex: filters.lastName, $options: "i" };
    if (filters.firstName) query.firstName = { $regex: filters.firstName, $options: "i" };
    if (filters.email) query.email = filters.email;
    if (filters.id) query.id = filters.id;
    if (filters.authToken) query.authToken = filters.authToken;
    if (filters.resetPasswordToken) query.resetPasswordToken = filters.resetPasswordToken;

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).populate([{
      path: 'cart',
      populate: [{
        path: 'products.product',
        populate: { path: 'category' }
      },
      {
        path: 'owner',
      }],
    }, {
      path: 'subscriptions',
      populate: {
        path: 'product',
        populate: { path: 'category' }
      }
    }, {
      path: 'addresses',
      model: 'Address'
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
    }, {
      path: 'subscriptions',
      populate: {
        path: 'product',
        populate: { path: 'category' }
      }
    }, {
      path: 'addresses'
    }]);
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
