import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User, { type IUser } from "../models/User"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

interface AuthRequest extends Request {
  user?: IUser
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
      throw new Error()
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const user = await User.findById(decoded.userId)
    if (!user) {
      throw new Error()
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: "Please authenticate" })
  }
}

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Access denied. Admin only." })
  }
}

