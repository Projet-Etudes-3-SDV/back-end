import mongoose, { Schema, type Document } from "mongoose"
import { IProduct } from "./product.model";
import { v4 as uuidv4 } from "uuid"
import { IUser } from "./user.model";


export interface ICart extends Document {
  id: string;
  products: { product: IProduct["_id"], quantity: number }[];
  owner: IUser["_id"];
}

const CartItemSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, unique: true },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true }
  }],
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, 
{ versionKey: false, timestamps: true });


export default mongoose.model<ICart>("Cart", CartItemSchema)
