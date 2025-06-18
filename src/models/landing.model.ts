import mongoose, { Schema } from "mongoose";
import { IProduct } from "./product.model";
import { v4 as uuidv4 } from "uuid";
import { ProductPriced } from "../types/pojos/product-priced.pojo";
import { ICategory } from "./category.model";

export interface ICarouselProduct {
    product: IProduct["_id"];
    order: number;
}

export interface ILanding {
    id: string;
    header: { title: string; subtitle?: string };
    carouselSection: { title: string; description?: string; products: ICarouselProduct[]; order: number };
    categorySection: { title: string; description?: string; order: number };
    alert?: { title: string; description?: string; type: AlertType; order: number };
    isMain: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PricedCarouselProduct {
    product: ProductPriced;
    order: number;
}

export enum AlertType {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    SUCCESS = "success"
}

export class LandingWithPricedProducts {
    id: string;
    header: { title: string; subtitle?: string };
    carouselSection: { title: string; description?: string; products: PricedCarouselProduct[]; order: number };
    categorySection: { title: string; description?: string; order: number; categories: ICategory[] };
    isMain: boolean;
    alert?: { title: string; description?: string; type: AlertType; order: number };
    createdAt?: Date;
    updatedAt?: Date;

    constructor(landing: ILanding, products: PricedCarouselProduct[], categories: ICategory[] = []) {
        this.id = landing.id;
        this.header = landing.header;
        this.carouselSection =  {
            ...landing.carouselSection,
            products
        };
        this.categorySection = {
            ...landing.categorySection,
            categories
        };
        this.isMain = landing.isMain;
        this.alert = landing.alert ? { ...landing.alert } : undefined;
        this.createdAt = landing.createdAt;
        this.updatedAt = landing.updatedAt;
    }
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
        alert: {
            title: { type: String, required: false },
            description: { type: String, required: false },
            type: {
                type: String,
                enum: Object.values(AlertType),
                required: false,
            },
            order: { type: Number, required: false },
        },
        isMain: {
            type: Boolean,
            default: false,
            required: true,
        }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export default mongoose.model<ILanding>("Landing", LandingSchema);
