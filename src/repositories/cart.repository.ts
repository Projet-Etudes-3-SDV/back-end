import Cart, { type ICart } from "../models/cart.model";

export class CartRepository {
  async create(cartData: Partial<ICart>): Promise<ICart> {
    const cart = new Cart(cartData);
    return await cart.save();
  }

  async findById(id: string): Promise<ICart | null> {
    return await Cart.findOne({ id }).populate({path: "products.product", populate: { path: "category" }}).populate("owner");
  }

  async findByUserId(userId: string): Promise<ICart | null> {
    return await Cart.findOne({ owner: userId }).populate({path: "products.product", populate: { path: "category" }}).populate("owner");
  }

  async update(id: string, cartData: Partial<ICart>): Promise<ICart | null> {
    return await Cart.findOneAndUpdate({ id }, cartData, { new: true }).populate({path: "products.product", populate: { path: "category" }}).populate("owner");
  }

  async delete(id: string): Promise<boolean> {
    const result = await Cart.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
