import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { plainToClass, plainToInstance } from "class-transformer";
import { UserPresenter, UserToCreate, UserToModify, SearchUserCriteria, UserCreationPresenter, UserLogin, ValidateUserDTO, AdminUserToModify, ValidateLogin } from "../types/dtos/userDtos";
import { validate } from "class-validator";
import { AppError } from "../utils/AppError";
import { EncodedRequest } from "../utils/EncodedRequest";
import { JWTService } from "../services/jwt.service";
import { AddressToCreate } from "../types/dtos/addressDtos";

export class UserController {
  private userService: UserService;
  private jwtService: JWTService;

  constructor() {
    this.userService = new UserService();
    this.jwtService = new JWTService()
  }

  async getMe(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.getUser(req.decoded.user.id);
      const userPresenter = plainToClass(UserPresenter, user, { excludeExtraneousValues: true });
      res.status(200).json(userPresenter);
    }
    catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = plainToClass(UserToCreate, req.body);
      const dtoErrors = await validate(userData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const user = await this.userService.createUser(userData);
      const userPresenter = plainToClass(UserCreationPresenter, user, { excludeExtraneousValues: true });
      res.status(201).json(userPresenter);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.getUser(req.params.id);
      const userPresenter = plainToClass(UserPresenter, user, { excludeExtraneousValues: true });
      res.status(200).json(userPresenter);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchCriteria = plainToClass(SearchUserCriteria, req.query);
      const dtoErrors = await validate(searchCriteria);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const { users, total, pages } = await this.userService.getUsers(searchCriteria);
      const userPresenters = plainToInstance(UserPresenter, users, { excludeExtraneousValues: true });
      res.status(200).json({ result: userPresenters, total, pages });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = plainToClass(UserToModify, req.body);
      const dtoErrors = await validate(userData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const user = await this.userService.updateUser(req.params.id, userData);
      const userPresenter = plainToClass(UserPresenter, user, { excludeExtraneousValues: true });
      res.status(200).json(userPresenter);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(200).json({ message: "User deleted" });
    } catch (error) {
      next(error);
    }
  }

  async patchUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = plainToClass(AdminUserToModify, req.body);
      const dtoErrors = await validate(userData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const user = await this.userService.patchUser(req.params.id, req.body);
      const userPresenter = plainToClass(UserPresenter, user, { excludeExtraneousValues: true });
      res.status(200).json(userPresenter);
    } catch (error) {
      next(error);
    }
  }

  async patchAccount(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = plainToClass(UserToModify, req.body);
      const dtoErrors = await validate(userData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const user = await this.userService.patchUser(req.decoded.user.id, req.body);
      const userPresenter = plainToClass(UserPresenter, user, { excludeExtraneousValues: true });
      res.status(200).json(userPresenter);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const userData = plainToClass(UserLogin, req.body);
      const dtoErrors = await validate(userData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }

      await this.userService.loginUser(email, password);

      res.status(200).json("Veuillez valider votre connexion à l'aide du code envoyé par mail");
    } catch (error) {
      next(error);
    }
  }

  async validateLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, authCode } = req.body;

      const userData = plainToClass(ValidateLogin, req.body);
      const dtoErrors = await validate(userData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }

      const user = await this.userService.validateLogin(email, authCode);

      const accessToken = this.jwtService.generateAccessToken(user);
      const refreshToken = this.jwtService.generateRefreshToken(user);

      res.status(200).json({ user: user, accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError("Refresh token is required", 400);
      }
      const decoded = await this.jwtService.verifyJWTSecret(refreshToken);

      const accessToken = this.jwtService.generateAccessToken(decoded.user)
      const newRefreshToken = this.jwtService.generateRefreshToken(decoded.user)

      res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      await this.userService.forgotPassword(email);
      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      next(error);
    }
  }

  async validateUserMail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validateUserDTO = plainToClass(ValidateUserDTO, req.body, { excludeExtraneousValues: true });

      const dtoErrors = await validate(validateUserDTO);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }

      const user = await this.userService.validateUser(validateUserDTO);
      
      const userPresenter = plainToClass(UserPresenter, user, { excludeExtraneousValues: true });

      res.status(200).json({ message: "User validated", userPresenter });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      await this.userService.resetPassword(token, newPassword);
      res.status(200).json({ message: "Password reset" });
    } catch (error) {
      next(error);
    }
  }

  async addAddress(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const addressData = plainToClass(AddressToCreate, req.body);
      const dtoErrors = await validate(addressData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }
      const user = await this.userService.addAddress(req.decoded.user.id, addressData);
      const userPresenter = plainToClass(UserPresenter, user, { excludeExtraneousValues: true });
      res.status(200).json(userPresenter);
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { index } = req.params;

      const addressIndexNumber = parseInt(index, 10);

      const user = await this.userService.deleteAddress(req.decoded.user.id, addressIndexNumber);
      const userPresenter = plainToClass(UserPresenter, user, { excludeExtraneousValues: true });
      res.status(200).json(userPresenter);
    } catch (error) {
      next(error);
    }
  }
}
