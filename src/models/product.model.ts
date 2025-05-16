import mongoose, { Schema, type Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import { ICategory } from "./category.model";
import { ICoupon } from "./coupon.model";

// Product model
export interface IProduct extends Document {
  id: string;
  name: string;
  description: string;
  category: ICategory["_id"];
  monthlyPrice: number;
  yearlyPrice: number;
  available: boolean;
  addedDate: Date;
  coupons: ICoupon["_id"][];
}

const ProductSchema: Schema = new Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    monthlyPrice: { type: Number, required: true },
    yearlyPrice: { type: Number, required: true },
    available: { type: Boolean, default: true },
    addedDate: { type: Date, default: Date.now },
    coupons: { type: Schema.Types.ObjectId, ref: "Coupon", required: true },
    stripeProductId: { type: String, default: null },
    stripePriceId: { type: String, default: null },
    stripePriceIdYearly: { type: String, default: null },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);