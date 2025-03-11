import { UserRepository } from "../repositories/user.repository";
import type { IUser } from "../models/user.model";
import { AppError } from "../utils/AppError";
import { UserToCreate, UserToModify, SearchUserCriteria } from "../types/dtos/userDtos";
import { sendEmail } from "./mail.service";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: UserToCreate): Promise<IUser> {
    const existingUser = await this.userRepository.findOneBy({ email: userData.email });
    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }
    return await this.userRepository.create(userData);
  }

  async loginUser(email: string, password: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new AppError("Invalid email or password", 401);
    }
    return user;
  }

  async getUser(_id: string): Promise<IUser> {
    const user = await this.userRepository.findById(_id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async getUsers(searchCriteria: SearchUserCriteria): Promise<{ users: IUser[]; total: number; pages: number }> {
    const { page = 1, limit = 10, ...filters } = searchCriteria;
    const { users, total } = await this.userRepository.findBy(filters, page, limit);
    const pages = Math.ceil(total / limit);
    return { users, total, pages };
  }

  async updateUser(_id: string, userData: UserToModify): Promise<IUser> {
    const user = await this.userRepository.findById(_id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const updatedUser = await this.userRepository.update(_id, userData);
    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }
    return updatedUser;
  }

  async deleteUser(_id: string): Promise<void> {
    const user = await this.userRepository.findById(_id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const result = await this.userRepository.delete(_id);
    if (!result) {
      throw new AppError("Failed to delete user", 500);
    }
  }

  async patchUser(_id: string, userData: Partial<IUser>): Promise<IUser> {
    const user = await this.userRepository.findById(_id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const updatedUser = await this.userRepository.update(_id, userData);
    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }
    return updatedUser;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.generatePasswordToken();
    sendEmail(user.email, "Password reset", `Click here to reset your password: http://localhost:3000/reset-password/${user.resetPasswordToken}`);

    await user.save();
  }
}