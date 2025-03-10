import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectMongooseDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/maptitecoloc";

    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};
