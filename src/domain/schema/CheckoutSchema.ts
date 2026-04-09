import { z } from "zod";

export const CheckoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^[0-9+\-\s]+$/, "Invalid phone number"),
  customerEmail: z.string().email("Invalid email").or(z.literal("")),
  shippingAddress: z.string().min(3, "Address is required"),
  shippingCity: z.string().min(2, "City is required"),
  paymentMethod: z.enum(["cod", "esewa", "khalti", "bank"]),
});

export type TCheckoutSchema = z.infer<typeof CheckoutSchema>;
