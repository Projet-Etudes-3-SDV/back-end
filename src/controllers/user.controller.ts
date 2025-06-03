import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { plainToClass, plainToInstance } from "class-transformer";
import { UserPresenter, UserToCreate, UserToModify, SearchUserCriteria, UserCreationPresenter, UserLogin, ValidateUserDTO } from "../types/dtos/userDtos";
import { validate } from "class-validator";
import { AppError } from "../utils/AppError";
import { EncodedRequest } from "../utils/EncodedRequest";
import { JWTService } from "../services/jwt.service";

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
      const userData = plainToClass(UserToModify, req.body);
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

      const user = await this.userService.loginUser(email, password);

      const userPresenter = plainToClass(UserPresenter, user, { excludeExtraneousValues: true });

      const accessToken = this.jwtService.generateAccessToken(userPresenter)
      const refreshToken = this.jwtService.generateRefreshToken(userPresenter)

      res.status(200).json({ userPresenter, accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const decoded = await this.jwtService.verifyJWTSecret(refreshToken);
      const user = plainToClass(UserPresenter, decoded.user, { excludeExtraneousValues: true });

      const accessToken = this.jwtService.generateAccessToken(user)
      const newRefreshToken = this.jwtService.generateRefreshToken(user)

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

  async validateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
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
}
