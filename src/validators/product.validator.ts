import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    richDescription: z.string().optional(),
    brand: z.string().min(1, "Brand is required"),
    price: z.number().min(0, "Price must be positive"),
    category: z.string().min(1, "Category is required"),
    countInStock: z.number().min(0, "Count in stock must be positive"),
    rating: z.number().optional(),
    numReviews: z.number().optional(),
    isFeatured: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    richDescription: z.string().optional(),
    brand: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    category: z.string().min(1).optional(),
    countInStock: z.number().min(0).optional(),
    rating: z.number().optional(),
    numReviews: z.number().optional(),
    isFeatured: z.boolean().optional(),
  }),
});
