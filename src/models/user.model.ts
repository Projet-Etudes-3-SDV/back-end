import mongoose, { Schema, type Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { ICart } from "./cart.model";
import { IAddress } from "./address.model";
import { IUserSubscription } from "./subscription.model";

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
  resetPasswordExpires?: Date;
  authToken?: string;
  isValidated: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordToken(): string;
  generateAuthToken(): string;
  addresses: IAddress[];
  paymentSessionId?: string;
  authCode?: string;
  authCodeExpires?: Date;
  generateAuthCode(): string;
  stripeCustomerId?: string;
}

export class UserWithSubscriptions {
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
  resetPasswordExpires?: Date;
  authToken?: string;
  isValidated: boolean;
  addresses: IAddress[];
  paymentSessionId?: string;
  authCode?: string;
  authCodeExpires?: Date;
  subscriptions?: IUserSubscription[];

  constructor(user: IUser, subscriptions?: IUserSubscription[]) {
    this.id = user.id;
    this.lastName = user.lastName;
    this.firstName = user.firstName;
    this.email = user.email;
    this.password = user.password;
    this.phone = user.phone;
    this.role = user.role;
    this.registrationDate = user.registrationDate;
    this.lastLogin = user.lastLogin;
    this.cart = user.cart;
    this.resetPasswordToken = user.resetPasswordToken;
    this.resetPasswordExpires = user.resetPasswordExpires;
    this.authToken = user.authToken;
    this.isValidated = user.isValidated;
    this.addresses = user.addresses || [];
    this.paymentSessionId = user.paymentSessionId;
    this.authCode = user.authCode;
    this.authCodeExpires = user.authCodeExpires;
    this.subscriptions = subscriptions || [];
  }
}

const UserSchema: Schema = new Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: UserRole, default: UserRole.USER },
    registrationDate: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    cart: { type: Schema.Types.ObjectId, ref: "Cart", default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    authToken: { type: String, default: null },
    isValidated: { type: Boolean, default: false },
    addresses: [{ type: Schema.Types.Mixed, default: [] }],
    paymentSessionId: { type: String, default: null },
    authCode: { type: String, default: null },
    authCodeExpires: { type: Date, default: null },
    stripeCustomerId: { type: String, default: null },
  },
  { versionKey: false, timestamps: true }
);

UserSchema.index(
  { resetPasswordToken: 1 },
  {
    unique: true,
    partialFilterExpression: { resetPasswordToken: { $ne: null, $exists: true } }
  }
);

UserSchema.index(
  { authToken: 1 },
  {
    unique: true,
    partialFilterExpression: { authToken: { $ne: null, $exists: true } }
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.generatePasswordToken = function (): string {
  const token = uuidv4();
  this.resetPasswordToken = token;
  this.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  return token;
};

UserSchema.methods.generateAuthToken = function (): string {
  const token = uuidv4();
  this.authToken = token;
  return token;
};

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateAuthCode = function (): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.authCode = code;
  this.authCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
  return code;
}

export default mongoose.model<IUser>("User", UserSchema);



