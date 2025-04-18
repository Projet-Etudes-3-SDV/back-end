import mongoose, { Schema } from "mongoose";
import { IProduct } from "./product.model";
import { v4 as uuidv4 } from "uuid";

export interface ICarouselProduct {
    product: IProduct["_id"];
    order: number;
}

export interface ILanding {
    id: string;
    header: { title: string; subtitle?: string };
    carouselSection?: { title: string; description?: string; products: ICarouselProduct[]; order: number };
    categorySection?: { title: string; description?: string; order: number };
}

const LandingSchema: Schema = new Schema<ILanding>(
    {
        id: { type: String, default: uuidv4, unique: true },
        header: {
            title: { type: String, required: true },
            subtitle: { type: String, required: false },
        },
        carouselSection: {
            title: { type: String, required: true },
            description: { type: String, required: false },
            products: [
                {
                    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                    order: { type: Number, required: true },
                },
            ],
            order: { type: Number, required: true },
        },
        categorySection: {
            title: { type: String, required: true },
            description: { type: String, required: false },
            order: { type: Number, required: true },
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export default mongoose.model<ILanding>("Landing", LandingSchema);
