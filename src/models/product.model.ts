import mongoose, { Schema, type Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"

// Product model
export interface IProduct extends Document {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  monthlyPrice: number;
  yearlyPrice: number;
  available: boolean;
  addedDate: Date;
}

const ProductSchema: Schema = new Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    monthlyPrice: { type: Number, required: true },
    yearlyPrice: { type: Number, required: true },
    available: { type: Boolean, default: true },
    addedDate: { type: Date, default: Date.now },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);