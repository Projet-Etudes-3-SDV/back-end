import mongoose, { Schema, type Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"

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
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["admin", "client", "support"], default: "client" },
    registrationDate: { type: Date, default: Date.now },
    lastLogin: { type: Date },
  },
  { versionKey: false, timestamps: true }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model<IUser>("User", UserSchema)



