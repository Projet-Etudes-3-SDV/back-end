import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { OrderToCreate, OrderToModify, OrderPresenter, SearchOrderCriteria, SortOrderCriteria } from "../types/dtos/orderDtos";
import { EncodedRequest } from "../utils/EncodedRequest";
import { AppError } from "../utils/AppError";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderData = plainToClass(OrderToCreate, req.body);
      const dtoErrors = await validate(orderData);
      if (dtoErrors.length > 0) {
        res.status(400).json({ errors: dtoErrors });
        return;
      }
      const order = await this.orderService.createOrder(orderData);
      const orderPresenter = plainToClass(OrderPresenter, order, { excludeExtraneousValues: true });
      res.status(201).json(orderPresenter);
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await this.orderService.getOrder(req.params.id);
      const orderPresenter = plainToClass(OrderPresenter, order, { excludeExtraneousValues: true });
      res.status(200).json(orderPresenter);
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchOrderCriteria = plainToClass(SearchOrderCriteria, req.query);
      const sortOrderCriteria = plainToClass(SortOrderCriteria, req.query);

      const dtoErrors = await validate(searchOrderCriteria);
      dtoErrors.push(...await validate(sortOrderCriteria));
      if (dtoErrors.length > 0) {
          const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
          }));
          throw new AppError("Validation failed", 400, errors);
      }
          
      const { orders, total } = await this.orderService.getOrders(searchOrderCriteria, searchOrderCriteria.page, searchOrderCriteria.limit, sortOrderCriteria);

      const orderPresenters = orders.map(order =>
        plainToClass(OrderPresenter, order, { excludeExtraneousValues: true })
      );
      res.status(200).json({ result: orderPresenters, total });
    } catch (error) {
      next(error);
    }
  }

  async getOrdersByUser(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const userId = req.decoded.user._id;
      const sortOrderCriteria = plainToClass(SortOrderCriteria, req.query);

      const dtoErrors = await validate(sortOrderCriteria);
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));
        throw new AppError("Validation failed", 400, errors);
      }      
      
      const { orders, total } = await this.orderService.getOrdersByUser(userId, page, limit, sortOrderCriteria);

      const orderPresenters = orders.map(order =>
        plainToClass(OrderPresenter, order, { excludeExtraneousValues: true })
      );
      res.status(200).json({ result: orderPresenters, total });
    } catch (error) {
      next(error);
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderData = plainToClass(OrderToModify, req.body);
      const dtoErrors = await validate(orderData);
      if (dtoErrors.length > 0) {
        res.status(400).json({ errors: dtoErrors });
        return;
      }
      const order = await this.orderService.updateOrder(req.params.id, orderData);
      const orderPresenter = plainToClass(OrderPresenter, order, { excludeExtraneousValues: true });
      res.status(200).json(orderPresenter);
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.orderService.deleteOrder(req.params.id);
      res.status(200).json({ message: "Order deleted" });
    } catch (error) {
      next(error);
    }
  }
}
