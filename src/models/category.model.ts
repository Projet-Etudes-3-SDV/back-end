import mongoose, { Schema, type Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"

// Category model
export interface ICategory extends Document {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

const CategorySchema: Schema = new Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String }
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<ICategory>("Category", CategorySchema);
