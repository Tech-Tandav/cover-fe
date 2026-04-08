import z from "zod";


const required = (msg: string) => z.string().min(1, msg);

export const BookingSchema = z.object({
    customerName: required("Customer name is required"),
    customerPhone: required("Customer name is required"),
    customerEmail: required("Customer name is required"),
})

export type TBookingSchema = z.infer<typeof BookingSchema>