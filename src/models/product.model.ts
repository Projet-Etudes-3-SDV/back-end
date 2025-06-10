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
  available: boolean;
  addedDate: Date;
  coupons: ICoupon["_id"][];
  stripeProductId: string;
  stripePriceId: string;
  stripePriceIdYearly: string;
  features: Array<{
    title: string;
    description: string;
  }>
}

const ProductSchema: Schema = new Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    features: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        _id: { type: Schema.Types.ObjectId, select: false }
      },
    ],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    available: { type: Boolean, default: true },
    addedDate: { type: Date, default: Date.now },
    coupons: { type: Schema.Types.ObjectId, ref: "Coupon", required: false },
    stripeProductId: { type: String, required: true },
    stripePriceId: { type: String, required: true },
    stripePriceIdYearly: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);