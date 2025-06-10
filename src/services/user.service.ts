import { UserRepository } from "../repositories/user.repository";
import type { IUser } from "../models/user.model";
import { UserToCreate, UserToModify, SearchUserCriteria, ValidateUserDTO } from "../types/dtos/userDtos";
import { sendEmail } from "./mail.service";
import { CartRepository } from "../repositories/cart.repository";
import { IAddress } from "../models/adress.model";
import { InvalidUserCredential, UserAdressNotFound, UserAlreadyExists, UserAlreadyValidated, UserAuthCodeExpired, UserAuthCodeInvalid, UserAuthCodeNotSet, UserDeletionFailed, UserFailedToUpdate, UserNotFound, UserNotValidated, UserPasswordResetTokenInvalid, UserValidationTokenInvalid } from "../types/errors/user.errors";

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
      throw new UserAlreadyExists()
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
      throw new InvalidUserCredential()
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new InvalidUserCredential
    }

    if (!user.isValidated) {
      user.generateAuthToken();
      await user.save();
      sendEmail(user.email, "Cyna: Confirmation du mail", `Cliquez ici pour valider votre compte: http://localhost:8100/account-validation/${user.authToken}`);
      throw new UserNotValidated()
    }

    await user.generateAuthCode();
    await user.save();
    sendEmail(user.email, "Cyna: Code de connexion", "Une connexion a été effectuée sur votre compte. Si ce n'est pas vous, veuillez changer votre mot de passe. Si c'est vous, voici votre code de connexion : " + user.authCode);

    return user;
  }

  async validateLogin(email:string, authCode: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new InvalidUserCredential();
    }

    if (!user.isValidated) {
      throw new UserNotValidated();
    }

    if (!user.authCode) {
      throw new UserAuthCodeNotSet();
    }
    if (!user.authCodeExpires || user.authCodeExpires < new Date()) {
      throw new UserAuthCodeExpired()
    }
    if (user.authCode !== authCode) {
      throw new UserAuthCodeInvalid()
    }

    user.authCode = undefined;
    user.authCodeExpires = undefined;

    return user;
  }

  async validateUser(authToken: ValidateUserDTO): Promise<IUser> {
    const user = await this.userRepository.findOneBy(authToken);
    if (!user) {
      throw new UserValidationTokenInvalid()
    }

    if (user.isValidated) {
      throw new UserAlreadyValidated()
    }

    user.isValidated = true;
    user.authToken = undefined;
    return await user.save();
  }

  async getUser(id: string): Promise<IUser> {
    console.log('id', id);
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFound()
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
      throw new UserNotFound();
    }
    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      throw new UserNotFound()
    }
    return updatedUser;
  }

  async updateUserPaymentSessionId(id: string, sessionId: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new UserNotFound();
    }
    user.paymentSessionId = sessionId;
    const updatedUser = await this.userRepository.update(id, user);
    if (!updatedUser) {
      throw new UserNotFound();
    }
    return updatedUser;
  }

  async getUserByPaymentSessionId(sessionId: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ paymentSessionId: sessionId });
    if (!user) {
      throw new UserNotFound();
    }
    return user;
  }

  async deleteUser(_id: string): Promise<void> {
    const user = await this.userRepository.findById(_id);
    if (!user) {
      throw new UserNotFound();
    }
    const result = await this.userRepository.delete(_id);
    if (!result) {
      throw new UserDeletionFailed();
    }
  }

  async patchUser(id: string, userData: Partial<IUser>): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new UserNotFound();
    }
    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      throw new UserNotFound();
    }
    return updatedUser;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UserNotFound();
    }

    user.generatePasswordToken();
    sendEmail(user.email, "Cyna: Réinitialisation du mot de passe", `Cliquez ici pour réinitialiser votre mot de passe: http://localhost:8100/reset-password/${user.resetPasswordToken}`);

    await user.save();
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ resetPasswordToken: token });
    if (!user) {
      throw new UserPasswordResetTokenInvalid();
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;

    await user.save();
  }

  async addAddress(id: string, address: IAddress): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UserNotFound();
    }

    if (!user.addresses) {
      user.addresses = [];
    }

    user.addresses.push(address);
    const updatedUser = await this.userRepository.update(id, { addresses: user.addresses });
    if (!updatedUser) {
      throw new UserFailedToUpdate();
    }

    return updatedUser;
  }

  async deleteAddress(id: string, addressIndex: number): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UserNotFound();
    }

    if (!user.addresses || user.addresses.length === 0) {
      throw new UserAdressNotFound();
    }

    user.addresses = user.addresses.filter((_, index) => index !== addressIndex);

    const updatedUser = await this.userRepository.update(id, { addresses: user.addresses });
    if (!updatedUser) {
      throw new UserFailedToUpdate();
    }

    return updatedUser;
  }
}