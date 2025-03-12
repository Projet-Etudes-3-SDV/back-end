import type { Response, NextFunction } from "express"
import { UserRole } from "../models/user.model"
import { AppError } from "../utils/AppError"
import { EncodedRequest } from "../utils/EncodedRequest"

export const adminMiddleware = (req: EncodedRequest, res: Response, next: NextFunction, role: UserRole[]) => {

    if (role.indexOf(req.decoded.user.role) === -1) {
      return next(new AppError("Forbidden", 403))
    }

    next()
}

