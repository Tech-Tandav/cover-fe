import { z } from "zod";

export const ProductCreateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(1, "Pick a category"),
  brand: z.string().min(1, "Pick a brand"),
  variants: z.array(z.string()).default([]),
  material: z.string().optional().default(""),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  description: z.string().optional().default(""),
  price: z.coerce.number().positive("Price must be greater than 0"),
  discount_price: z
    .union([z.coerce.number().positive(), z.literal("")])
    .optional(),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  is_active: z.boolean().default(true),
  hot_sale_live: z.boolean().default(false),
  is_new: z.boolean().default(false),
});

export type TProductCreateSchema = z.infer<typeof ProductCreateSchema>;
