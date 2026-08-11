import { Product } from "../models/product";
import { Category } from "../models/category";
import mongoose from "mongoose";
import { upload } from "../middleware/upload";

export const createProduct = async (productData: any, imageUrl?: string) => {
  const product = new Product({
    name: productData.name,
    description: productData.description,
    richDescription: productData.richDescription,
    image: imageUrl ? [imageUrl] : [],
    brand: productData.brand,
    price: productData.price,
    category: productData.category,
    countInStock: productData.countInStock,
    rating: productData.rating,
    numReviews: productData.numReviews,
    isFeatured: productData.isFeatured,
  });
  return await product.save();
};

export const updateProduct = async (id: string, productData: any, imageUrl?: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid Product Id");
  }
  const category = await Category.findById(productData.category);
  if (!category) {
    throw new Error("Invalid Category");
  }
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Invalid Product!");
  }

  const updateData: any = { ...productData };
  if (imageUrl) {
    updateData.image = [imageUrl];
  }

  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

export const getProductById = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid Product Id");
  }
  return await Product.findById(id).populate("category");
};

export const getAllProducts = async (query: any) => {
  let filter: Record<string, unknown> = {};
  if (query.categories) {
    filter = { category: query.categories.split(",") };
  }
  return await Product.find(filter).populate("category");
};

export const deleteProduct = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid Product Id");
  }
  return await Product.findByIdAndDelete(id);
};

export const getProductCount = async () => {
  return await Product.countDocuments();
};

export const getFeaturedProducts = async (count: number) => {
  return await Product.find({ isFeatured: true }).limit(count);
};

export const updateProductGallery = async (id: string, imagesPaths: string[]) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid Product Id");
  }
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Invalid Product!");
  }
  return await Product.findByIdAndUpdate(id, { images: imagesPaths }, { new: true });
};
