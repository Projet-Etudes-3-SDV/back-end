import mongoose, { Schema, type Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import { IProduct } from "./product.model";

// Coupon model
export interface ICoupon extends Document {
  id: string;
  code: string;
  name: string;
  discount: number;
  expirationDate: Date;
  products: IProduct["_id"][];
}

const CouponSchema: Schema = new Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    code: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    discount: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product", default: [] }],
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<ICoupon>("Coupon", CouponSchema);
