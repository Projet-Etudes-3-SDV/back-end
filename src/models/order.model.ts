import mongoose, { Schema, type Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import { IUser } from "./user.model"
import { SubscriptionPlan } from "./subscription.model";
import { IProduct } from "./product.model";

export interface IOrder extends Document {
  id: string;
  user: IUser["_id"];
  total: number;
  status: OrderStatus;
  sessionId?: string;
  orderDate: Date;
  products: {
    product: IProduct["_id"];
    plan: SubscriptionPlan;
  }[]
}

export enum OrderStatus {
  PAID = "paid",
  PENDING = "pending",
  CANCELLED = "cancelled",
}

const OrderSchema: Schema = new Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: OrderStatus, default: "pending" },
    orderDate: { type: Date, default: Date.now },
    sessionId: { type: String, default: null },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        plan: { type: String, enum: SubscriptionPlan, required: true },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);