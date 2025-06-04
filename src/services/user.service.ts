import { UserRepository } from "../repositories/user.repository";
import type { IUser } from "../models/user.model";
import { AppError } from "../utils/AppError";
import { UserToCreate, UserToModify, SearchUserCriteria, ValidateUserDTO } from "../types/dtos/userDtos";
import { sendEmail } from "./mail.service";
import { CartRepository } from "../repositories/cart.repository";
import { IAddress } from "../models/adress.model";

export class UserService {
  private userRepository: UserRepository;
  private cartRepository: CartRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.cartRepository = new CartRepository();
  }

  async createUser(userData: UserToCreate): Promise<IUser> {
    const existingUser = await this.userRepository.findOneBy({ email: userData.email });
    if (existingUser) {
      throw new AppError("Email already in use", 400, [], "EMAIL_ALREADY_IN_USE");
    }

    const user = await this.userRepository.create(userData);
    const cart = await this.cartRepository.create({ owner: user._id });
    user.cart = cart._id;
    
    user.generateAuthToken();

    sendEmail(user.email, "Confirmation du mail", `Cliquez ici pour valider votre compte: http://localhost:8100/account-validation/${user.authToken}`);

    return await user.save();
  }

  async loginUser(email: string, password: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new AppError("Invalid email or password", 401, [], "INVALID_CREDENTIALS");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new AppError("Invalid email or password", 401, [], "INVALID_CREDENTIALS");
    }

    if (!user.isValidated) {
      user.generateAuthToken();
      await user.save();
      sendEmail(user.email, "Confirmation du mail", `Cliquez ici pour valider votre compte: http://localhost:8100/account-validation/${user.authToken}`);
      throw new AppError("You have to validate your account", 401, [], "ACCOUNT_NOT_VALIDATED");
    }

    return user;
  }

  async validateUser(authToken: ValidateUserDTO): Promise<IUser> {
    const user = await this.userRepository.findOneBy(authToken);
    if (!user) {
      throw new AppError("User not found", 404, [], "INVALID_TOKEN");
    }

    if (user.isValidated) {
      throw new AppError("User already validated", 400, [], "ACCOUNT_ALREADY_VALIDATED");
    }

    user.isValidated = true;
    user.authToken = undefined;
    return await user.save();
  }

  async getUser(id: string): Promise<IUser> {
    console.log('id', id);
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404, [], "NO_USER_FOUND");
    }
    return user;
  }

  async getUsers(searchCriteria: SearchUserCriteria): Promise<{ users: IUser[]; total: number; pages: number }> {
    const { page = 1, limit = 10, ...filters } = searchCriteria;
    const { users, total } = await this.userRepository.findBy(filters, page, limit);
    const pages = Math.ceil(total / limit);
    return { users, total, pages };
  }

  async updateUser(id: string, userData: UserToModify): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new AppError("User not found", 404, [], "NO_USER_FOUND");
    }
    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      throw new AppError("User not found", 404, [], "NO_USER_FOUND");
    }
    return updatedUser;
  }

  async updateUserPaymentSessionId(id: string, sessionId: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new AppError("User not found", 404, [], "NO_USER_FOUND");
    }
    user.paymentSessionId = sessionId;
    const updatedUser = await this.userRepository.update(id, user);
    if (!updatedUser) {
      throw new AppError("User not found", 404, [], "NO_USER_FOUND");
    }
    return updatedUser;
  }

  async getUserByPaymentSessionId(sessionId: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ paymentSessionId: sessionId });
    if (!user) {
      throw new AppError("User not found", 404, [], "NO_USER_FOUND");
    }
    return user;
  }

  async deleteUser(_id: string): Promise<void> {
    const user = await this.userRepository.findById(_id);
    if (!user) {
      throw new AppError("User not found", 404, [], "NO_USER_FOUND");
    }
    const result = await this.userRepository.delete(_id);
    if (!result) {
      throw new AppError("Failed to delete user", 500, [], "FAILED_TO_DELETE_USER");
    }
  }

  async patchUser(id: string, userData: Partial<IUser>): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new AppError("User not found", 404, [], "NO_USER_FOUND");
    }
    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      throw new AppError("User not found", 404, [], "NO_USER_FOUND");
    }
    return updatedUser;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new AppError("User not found", 404, [], "NO_USER_FOUND");
    }

    user.generatePasswordToken();
    sendEmail(user.email, "Password reset", `Click here to reset your password: http://localhost:8100/reset-password/${user.resetPasswordToken}`);

    await user.save();
  }

  async renewEmailConfirmation(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new AppError("User not found", 404, [], "NO_USER_FOUND");
    }

    user.generateAuthToken();
    sendEmail(user.email, "Confirmation du mail", `Cliquez ici pour valider votre compte: http://localhost:8100/account-validation/${user.authToken}`);

    await user.save();
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ resetPasswordToken: token });
    if (!user) {
      throw new AppError("Invalid token", 400, [], "INVALID_TOKEN");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;

    await user.save();
  }

  async addAddress(id: string, address: IAddress): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new AppError("User not found", 404, [], "NO_USER_FOUND");
    }

    if (!user.addresses) {
      user.addresses = [];
    }

    user.addresses.push(address);
    const updatedUser = await this.userRepository.update(id, { addresses: user.addresses });
    if (!updatedUser) {
      throw new AppError("Failed to update user addresses", 500, [], "FAILED_TO_UPDATE_ADDRESSES");
    }

    return updatedUser;
  }

  async deleteAddress(id: string, addressIndex: number): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new AppError("User not found", 404, [], "NO_USER_FOUND");
    }

    if (!user.addresses || user.addresses.length === 0) {
      throw new AppError("No addresses found for user", 404, [], "NO_ADDRESSES_FOUND");
    }

    user.addresses = user.addresses.filter((_, index) => index !== addressIndex);

    const updatedUser = await this.userRepository.update(id, { addresses: user.addresses });
    if (!updatedUser) {
      throw new AppError("Failed to update user addresses", 500, [], "FAILED_TO_UPDATE_ADDRESSES");
    }

    return updatedUser;
  }
}