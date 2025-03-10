import mongoose, { Schema, type Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"

// Category model
export interface ICategory extends Document {
  _id: string;
  name: string;
  description: string;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<ICategory>("Category", CategorySchema);
