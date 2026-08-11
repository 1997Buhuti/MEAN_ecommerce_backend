import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    orderItems: z.array(
      z.object({
        quantity: z.number().min(1),
        product: z.string().min(1),
      })
    ),
    shippingAddress1: z.string().min(1, "Shipping address is required"),
    shippingAddress2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    zip: z.string().min(1, "Zip is required"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().min(1, "Phone is required"),
    status: z.string().optional(),
    user: z.string().optional(),
  }),
});

export const updateOrderSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    status: z.string().min(1, "Status is required"),
  }),
});
