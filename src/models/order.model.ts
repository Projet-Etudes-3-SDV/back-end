import mongoose, { Schema, type Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import { IUser } from "./user.model"

export interface IOrder extends Document {
  id: string;
  userId: IUser["id"];
  total: number;
  status: "paid" | "pending" | "cancelled";
  orderDate: Date;
}

const OrderSchema: Schema = new Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ["paid", "pending", "cancelled"], default: "pending" },
    orderDate: { type: Date, default: Date.now },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);