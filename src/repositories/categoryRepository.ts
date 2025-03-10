import Category, { ICategory } from "../models/category.model";

class CategoryRepository {
  async create(data: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(data);
    return await category.save();
  }

  async findById(id: string): Promise<ICategory | null> {
    return await Category.findById(id).exec();
  }

  async updateById(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteById(id: string): Promise<ICategory | null> {
    return await Category.findByIdAndDelete(id).exec();
  }

  async find(criteria: any, page: number, limit: number): Promise<ICategory[]> {
    return await Category.find(criteria)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }
}

export default new CategoryRepository();
