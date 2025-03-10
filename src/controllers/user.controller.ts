import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { plainToClass, plainToInstance } from "class-transformer";
import { UserPresenter, UserToCreate, UserToModify, SearchUserCriteria } from "../types/dtos/userDtos";
import { validate } from "class-validator";
import { AppError } from "../utils/AppError";
import { EncodedRequest } from "../utils/EncodedRequest";
import { UserRole } from "../models/user.model";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
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
      const userPresenter = plainToClass(UserPresenter, user, { excludeExtraneousValues: true });
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
      const result = await this.userService.getUsers(searchCriteria);
      const userPresenters = plainToInstance(UserPresenter, result.users, { excludeExtraneousValues: true });
      res.status(200).json(userPresenters);
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
}
