import type { Response, NextFunction } from "express"
import { UserRole } from "../models/user.model"
import { AppError } from "../utils/AppError"
import { EncodedRequest } from "../utils/EncodedRequest"

export const adminMiddleware = (req: EncodedRequest, res: Response, next: NextFunction) => {

    if (req.decoded.user.role === UserRole.USER) {
      return next(new AppError("Forbidden", 403))
    }

    next()
}

