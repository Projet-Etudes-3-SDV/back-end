import mongoose, { Schema, type Document } from "mongoose";
import { IProduct } from "./product.model";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "./user.model";
import { SubscriptionPlan } from "./subscription.model";
import { ProductPriced } from "../types/pojos/product-priced.pojo";

export interface ICart extends Document {
  id: string;
  products: { product: IProduct["_id"], quantity: number, plan: SubscriptionPlan }[];
  owner: IUser["_id"];
  status: CartStatus;
}

export interface ICartWithPrices extends Omit<ICart, 'products'> {
  id: string;
  products: { product: ProductPriced, quantity: number, plan: SubscriptionPlan }[];
  owner: IUser["_id"];
  status: CartStatus;
}

export enum CartStatus {
  READY = "ready",
  PENDING = "pending",
}

export class CartWithPricedProducts {
  id!: string;
  products: { product: ProductPriced, quantity: number, plan: SubscriptionPlan }[];
  owner: IUser;
  status: CartStatus;

  constructor(cart: ICart, products: ProductPriced[]) {
    this.id = cart.id;
    this.owner = cart.owner;
    this.products = []
    for (const product of products) {
      const cartProduct = cart.products.find(p => p.product.id === product.id);
      if (cartProduct) {
        this.products.push({
          product,
          quantity: cartProduct.quantity,
          plan: cartProduct.plan
        });
      }
    }
    this.status = cart.status;
  }
}

const CartItemSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, unique: true },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    plan: { type: String, enum: SubscriptionPlan, required: true }
  }],
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: CartStatus, default: CartStatus.READY }
}, 
{ versionKey: false, timestamps: true });

export default mongoose.model<ICart>("Cart", CartItemSchema);
