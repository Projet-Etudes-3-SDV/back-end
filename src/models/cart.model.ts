import mongoose, { Schema, type Document } from "mongoose";
import { IProduct } from "./product.model";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "./user.model";
import { SubscriptionPlan } from "./subscription.model";

export interface ICart extends Document {
  id: string;
  products: { product: IProduct["_id"], quantity: number, plan: SubscriptionPlan }[];
  owner: IUser["_id"];
  status: CartStatus;
}

export enum CartStatus {
  READY = "ready",
  PENDING = "pending",
}

const CartItemSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, unique: true },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    plan: { type: String, enum: SubscriptionPlan, required: true }
  }],
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: CartStatus, default: "ready" },
}, 
{ versionKey: false, timestamps: true });

export default mongoose.model<ICart>("Cart", CartItemSchema);
