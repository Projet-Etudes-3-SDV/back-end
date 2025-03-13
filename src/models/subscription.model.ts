import mongoose, { Schema, type Document } from "mongoose"
import { IProduct } from "./product.model";
import { v4 as uuidv4 } from "uuid"
import { IUser } from "./user.model";


export interface ISubscription extends Document {
  id: string;
  plan: "monthly" | "yearly" | "free-trial";
  startDate: Date;
  endDate: Date;
  status: "active" | "cancelled" | "expired" | "trial";
  autoRenew: boolean;
  user: IUser["_id"]
  product: IProduct["_id"]
}

export enum SubscriptionPlan {
  MONTHLY = "monthly",
  YEARLY = "yearly",
  FREE_TRIAL = "free-trial",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  TRIAL = "trial",
}

const SubscriptionSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, unique: true },
  plan: { type: String, enum: SubscriptionPlan, default: "free-trial" },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: null },
  status: { type: String, enum: SubscriptionStatus, default: "trial" },
  autoRenew: { type: Boolean, default: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true }
}, 
{ versionKey: false, timestamps: true });

SubscriptionSchema.pre<ISubscription>("save", async function (next) {
  if (!this.isModified("startDate") && !this.isModified("plan")) return next()

  switch(this.plan) {
    case "free-trial": 
        this.endDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
        this.status = SubscriptionStatus.TRIAL
        break;
    case "monthly": 
        this.endDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
        this.status = SubscriptionStatus.ACTIVE
        break;
    case "yearly": 
        this.endDate = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);
        this.status = SubscriptionStatus.ACTIVE
        break;
  }
  
  next()
})

export default mongoose.model<ISubscription>("Subscription", SubscriptionSchema)
