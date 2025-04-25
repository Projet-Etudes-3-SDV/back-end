import type { Request, Response, NextFunction } from "express";
import { LandingService } from "../services/landing.service";
import { plainToClass, plainToInstance } from "class-transformer";
import { LandingToCreate, LandingToModify, LandingPresenter } from "../types/dtos/landingDtos";
import { validate } from "class-validator";
import { AppError } from "../utils/AppError";

export class LandingController {
  private landingService: LandingService;

  constructor() {
    this.landingService = new LandingService();
  }

  async createLanding(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const landingData = plainToClass(LandingToCreate, req.body);
      const dtoErrors = await validate(landingData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }

      const landing = await this.landingService.createLanding(landingData);
      const landingPresenter = plainToClass(LandingPresenter, landing, { excludeExtraneousValues: true });
      res.status(201).json(landingPresenter);
    } catch (error) {
      next(error);
    }
  }

  async getLandingById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const landing = await this.landingService.getLandingById(req.params.id);
      if (!landing) {
        throw new AppError("Landing not found", 404, [], "LANDING_NOT_FOUND");
      }
      const landingPresenter = plainToClass(LandingPresenter, landing, { excludeExtraneousValues: true });
      res.status(200).json(landingPresenter);
    } catch (error) {
      next(error);
    }
  }

  async getAllLandings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { landings, total } = await this.landingService.getAllLandings(page, limit);
      const landingPresenters = plainToInstance(LandingPresenter, landings, { excludeExtraneousValues: true });

      res.status(200).json({ result: landingPresenters, total, page, limit });
    } catch (error) {
      next(error);
    }
  }

  async updateLanding(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const landingData = plainToClass(LandingToModify, req.body);
      const dtoErrors = await validate(landingData);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }

      const landing = await this.landingService.updateLanding(req.params.id, landingData);
      if (!landing) {
        throw new AppError("Landing not found", 404, [], "LANDING_NOT_FOUND");
      }
      const landingPresenter = plainToClass(LandingPresenter, landing, { excludeExtraneousValues: true });
      res.status(200).json(landingPresenter);
    } catch (error) {
      next(error);
    }
  }

  async deleteLanding(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const success = await this.landingService.deleteLanding(req.params.id);
      if (!success) {
        throw new AppError("Landing not found", 404, [], "LANDING_NOT_FOUND");
      }
      res.status(200).json({ message: "Landing deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
