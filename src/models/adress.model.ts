import mongoose, { Schema, type Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import { IUser } from "./user.model"

export interface IAddress extends Document {
  id: string;
  userId: IUser["_id"];
  street: string;
  city: string;
  postalCode: string;
  country: string;
  type: "billing" | "shipping";
}

const AddressSchema: Schema = new Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    type: { type: String, enum: ["billing", "shipping"], required: true },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IAddress>("Address", AddressSchema);
