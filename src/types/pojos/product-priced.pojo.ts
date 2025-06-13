import { ICategory } from "../../models/category.model";
import { IProduct } from "../../models/product.model";

export class ProductPriced {
  _id: IProduct["_id"];
  id: string;
  name: string;
  description: string;
  category: ICategory;
  monthlyPrice: number;
  yearlyPrice: number;
  available: boolean;
  features: Array<{ title: string; description: string }>;
  stripePriceId: string
  stripePriceIdYearly: string
  stripeProductId: string
  count?: number
  imageUrl?: string;
  monthlyPurchaseAmount: number;
  yearlyPurchaseAmount: number;

  constructor(product: IProduct, monthlyPrice: number, yearlyPrice: number) {
    this._id = product._id;
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.category = product.category;
    this.monthlyPrice = monthlyPrice;
    this.yearlyPrice = yearlyPrice;
    this.available = product.available;
    this.features = product.features?.map(f => ({
      title: f.title,
      description: f.description
    })) || [];
    this.stripePriceId = product.stripePriceId
    this.stripePriceIdYearly = product.stripePriceIdYearly
    this.stripeProductId = product.stripeProductId
    this.imageUrl = product.imageUrl;
    this.monthlyPurchaseAmount = product.monthlyPurchaseAmount;
    this.yearlyPurchaseAmount = product.yearlyPurchaseAmount;
  }
}