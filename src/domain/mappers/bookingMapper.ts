import {
  IBookingApi,
  IBooking,
} from "@/domain/interfaces/bookingInterface";


// Booking mapping
export const mapBooking = (booking: IBookingApi): IBooking => ({
  id: booking.id,
  futsalName: booking.futsal_name,
  date: booking.date,
  startTime: booking.start_time,
  endTime: booking.end_time,
  customerName: booking.customer_name,
  customerPhone: booking.customer_phone,
  customerEmail: booking.customer_email,
  status: booking.status,
  createdAt: booking.created_at,
});
