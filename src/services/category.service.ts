import { Category } from "../models/category";

export const createCategory = async (categoryData: any) => {
  const category = new Category({
    name: categoryData.name,
    icon: categoryData.icon,
    color: categoryData.color,
  });
  return await category.save();
};

export const updateCategory = async (id: string, categoryData: any) => {
  const existingCategory = await Category.findById(id);
  const updateData: any = { ...categoryData };
  if (!updateData.icon && existingCategory) {
    updateData.icon = existingCategory.icon;
  }
  return await Category.findByIdAndUpdate(id, updateData, { new: true });
};

export const getCategoryById = async (id: string) => {
  return await Category.findById(id);
};

export const getAllCategories = async () => {
  return await Category.find();
};

export const deleteCategory = async (id: string) => {
  return await Category.findByIdAndDelete(id);
};
