import { UserRepository } from "../repositories/user.repository";
import { UserWithSubscriptions, type IUser } from "../models/user.model";
import { UserToCreate, UserToModify, SearchUserCriteria, ValidateUserDTO, AdminSearchUserCriteria, SortUserCriteria } from "../types/dtos/userDtos";
import { sendHtmlEmail } from "./mail.service";
import { CartRepository } from "../repositories/cart.repository";
import { IAddress } from "../models/address.model";
import { InvalidUserCredential, UserAdressNotFound, UserAlreadyExists, UserAlreadyValidated, UserAuthCodeExpired, UserAuthCodeInvalid, UserAuthCodeNotSet, UserAuthTokenCreationFailed, UserDeletionFailed, UserFailedToUpdate, UserNotFound, UserNotValidated, UserPasswordResetTokenInvalid, UserValidationTokenInvalid } from "../types/errors/user.errors";
import { SubscriptionService } from "./subscription.service";
import { IUserSubscription } from "../types/dtos/subscriptionDtos";
import { readFileSync } from "fs";
import { join } from "path";
import Handlebars from 'handlebars';

export class UserService {
  private userRepository: UserRepository;
  private cartRepository: CartRepository;
  private subscriptionService: SubscriptionService;

  constructor() {
    this.userRepository = new UserRepository();
    this.cartRepository = new CartRepository();
    this.subscriptionService = new SubscriptionService();
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

    if (!user.authToken) {
      throw new UserAuthTokenCreationFailed()
    }

    const templateContent = readFileSync(join(process.cwd(), 'templates', 'email-validation-template.html'), 'utf-8');
    const htmlTemplate = Handlebars.compile(templateContent);

    sendHtmlEmail(user.email, "Cyna: Confirmation du mail", htmlTemplate({ authToken: user.authToken }));

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
      const templateContent = readFileSync(join(process.cwd(), 'templates', 'email-validation-template.html'), 'utf-8');
      const htmlTemplate = Handlebars.compile(templateContent);
      if (!user.authToken){
        throw new UserAuthTokenCreationFailed()
      }

      sendHtmlEmail(user.email, "Cyna: Confirmation du mail", htmlTemplate({ authToken: user.authToken }));
      throw new UserNotValidated()
    }

    await user.generateAuthCode();
    await user.save();
    const templateContent = readFileSync(join(process.cwd(), 'templates', 'auth-code-validation-template.html'), 'utf-8');
    const htmlTemplate = Handlebars.compile(templateContent);

    if (!user.authCode) {
      throw new UserAuthCodeExpired()
    }
    
    sendHtmlEmail(user.email, "Cyna: Code de connexion", htmlTemplate({ authCode: user.authCode, path: join(process.cwd(), 'templates') }));

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

  async getUser(id: string): Promise<UserWithSubscriptions> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFound()
    }
    if (user.stripeCustomerId) {
      const userWithSubscriptions: UserWithSubscriptions = new UserWithSubscriptions(user, await this.subscriptionService.getUserSubscription(user.stripeCustomerId));
      return userWithSubscriptions;
    }

    return user;
  }

  async getUsers(searchCriteria: SearchUserCriteria, sortCriteria: SortUserCriteria): Promise<{ users: UserWithSubscriptions[]; total: number; pages: number }> {
    const { page = 1, limit = 10, ...filters } = searchCriteria;
    const { users, total } = await this.userRepository.findBy(filters, page, limit, sortCriteria);
    const pages = Math.ceil(total / limit);

    const usersWithSubscriptions = await Promise.all(users.map(async (user) => {
      let subscriptions: IUserSubscription[] = [];

      if (user.stripeCustomerId) {
        try {
          subscriptions = await this.subscriptionService.getUserSubscription(user.stripeCustomerId);
        } catch (error) {
          console.error(`Erreur lors de la récupération des abonnements pour l'utilisateur ${user.id}:`, error);
          subscriptions = [];
        }
      }

      // Fusionner correctement les données utilisateur avec les abonnements
      const userWithSubscriptions: UserWithSubscriptions = new UserWithSubscriptions(user, subscriptions);

      return userWithSubscriptions;
    }));

    return { users: usersWithSubscriptions, total, pages };
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

  async getUserByStripeCustomerId(stripeCustomerId: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ stripeCustomerId });
    if (!user) {
      throw new UserNotFound();
    }
    return user;
  }

  async getUserBy(userData: AdminSearchUserCriteria): Promise<IUser> {
    const user = await this.userRepository.findOneBy(userData);
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
    sendHtmlEmail(user.email, "Cyna: Réinitialisation du mot de passe", `Cliquez ici pour réinitialiser votre mot de passe: http://localhost:8100/reset-password/${user.resetPasswordToken}`);

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