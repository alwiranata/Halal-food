import { z } from "zod";

export const createProductValidation = z.object({
  product_name: z
    .string()
    .min(1, "Product name must be at least 3 characters")
    .max(100, "Product name must not exceed 100 characters"),

  description: z
    .string()
    .min(1, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),

  price: z.coerce.number().positive("Price must be greater than 0"),

  stock: z.coerce
    .number()
    .int("Stock must be integer")
    .min(0, "Stock cannot be negative"),

  is_halal: z.boolean().optional(),
});

export const updateProductValidation = createProductValidation.partial();

export type CreateProductInput = z.infer<typeof createProductValidation>;

export type UpdateProductInput = z.infer<typeof updateProductValidation>;
