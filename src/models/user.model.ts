import mongoose, { Schema, type Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import { ICart } from "./cart.model";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPERADMIN = "superadmin",
  SUPPORT = "support",
}

export interface IUser extends Document {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  registrationDate: Date;
  lastLogin?: Date;
  cart: ICart["_id"][];
  resetPasswordToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>
  generatePasswordToken(): string
  isSubscriptionActive(): boolean
  cancelSubscription(): void
  updateSubscriptionEndDate(newEndDate: Date): void
  subscription: ISubscription
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

export interface ISubscription {
  plan: "monthly" | "yearly" | "free-trial";
  startDate: Date;
  endDate: Date;
  status: "active" | "cancelled" | "expired" | "trial";
  autoRenew: boolean;
}

const UserSchema: Schema = new Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["admin", "client", "support", "superadmin"], default: "client" },
    registrationDate: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    cart: { type: Schema.Types.ObjectId, ref: "Cart", default: null },
    resetPasswordToken: { type: String, default: null },
    subscription: {
      plan: { type: String, enum: SubscriptionPlan, default: "free-trial" },
      startDate: { type: Date, default: Date.now },
      endDate: { type: Date, default: null },
      status: { type: String, enum: SubscriptionStatus, default: "trial" },
      autoRenew: { type: Boolean, default: true },
    }
  },
  { versionKey: false, timestamps: true }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.generatePasswordToken = function (): string {
  const token = uuidv4()
  this.resetPasswordToken = token
  return token
}

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

UserSchema.methods.isSubscriptionActive = function (): boolean {
  return this.subscription && this.subscription.status === "active" && new Date() < new Date(this.subscription.endDate);
};

UserSchema.methods.cancelSubscription = function () {
  this.subscription.status = "cancelled";
  this.subscription.autoRenew = false;
  this.save();
};

UserSchema.methods.updateSubscriptionEndDate = function (newEndDate: Date) {
  this.subscription.endDate = newEndDate;
  this.subscription.status = "active";
  this.save();
};

export default mongoose.model<IUser>("User", UserSchema)



